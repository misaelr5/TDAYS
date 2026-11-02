import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import type { Page, TestInfo } from "@playwright/test";

/** Load real lazy media, then restore initial scroll positions. No DOM replacement. */
export async function prepareVisual(page: Page) {
  // References include the approved opaque fallback, independent of the host's
  // accessibility settings. The normal transparency path has its own Axe tests.
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", { features: [
    { name: "prefers-reduced-motion", value: "reduce" },
    { name: "prefers-reduced-transparency", value: "reduce" },
    { name: "prefers-contrast", value: "no-preference" },
  ] });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  for (const image of await page.locator("img").all()) {
    if (!(await image.isVisible())) continue;
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(element => (element as HTMLImageElement).decode());
  }
  await page.locator("[data-carousel-viewport]").evaluateAll(elements => elements.forEach(element => element.scrollTo({ left: 0, behavior: "instant" })));
  await page.mouse.move(0, 0);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(() => scrollY === 0);
  await page.waitForFunction(() => location.pathname !== "/" || !document.querySelector(".site-header")?.classList.contains("header-solid"));
}

/** Historical differences are evidence, never a claim the old design is current. */
export async function compareHistorical(name: string, current: Buffer, testInfo: TestInfo) {
  const output = testInfo.outputPath("history");
  mkdirSync(output, { recursive: true });
  const reference = `tests/__screenshots__/chromium/${name}.png`;
  writeFileSync(join(output, `${name}-actual.png`), current);
  if (!existsSync(reference)) {
    await testInfo.attach("historia", { body: JSON.stringify({ reference: null, note: "Sin captura histórica; se valida el diseño actual." }), contentType: "application/json" });
    return;
  }
  const expected = readFileSync(reference);
  const before = await sharp(expected).metadata();
  const after = await sharp(current).metadata();
  const width = Math.min(before.width!, after.width!);
  const height = Math.min(before.height!, after.height!);
  const region = { left: 0, top: 0, width, height };
  const left = await sharp(expected).extract(region).ensureAlpha().raw().toBuffer();
  const right = await sharp(current).extract(region).ensureAlpha().raw().toBuffer();
  const diff = Buffer.alloc(left.length);
  let changedPixels = 0;
  for (let offset = 0; offset < left.length; offset += 4) {
    const changed = left[offset] !== right[offset] || left[offset + 1] !== right[offset + 1] || left[offset + 2] !== right[offset + 2] || left[offset + 3] !== right[offset + 3];
    if (changed) changedPixels++;
    const gray = Math.round((left[offset] + left[offset + 1] + left[offset + 2]) / 3 * .3 + 175);
    diff[offset] = changed ? 231 : gray;
    diff[offset + 1] = changed ? 98 : gray;
    diff[offset + 2] = changed ? 74 : gray;
    diff[offset + 3] = 255;
  }
  await sharp(diff, { raw: { width, height, channels: 4 } }).png().toFile(join(output, `${name}-diff.png`));
  const report = {
    reference, purpose: "Historia informativa; regresión contra current/ sin normalizar el DOM.",
    originalSize: [before.width, before.height], currentSize: [after.width, after.height], changedPixelsInCommonArea: changedPixels,
    fullPageIdentical: before.width === after.width && before.height === after.height && changedPixels === 0,
  };
  writeFileSync(join(output, `${name}.json`), JSON.stringify(report, null, 2));
  await testInfo.attach("historia", { body: JSON.stringify(report), contentType: "application/json" });
}
