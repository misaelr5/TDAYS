import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import type { Page, TestInfo } from "@playwright/test";

const output = "output/migration/visual";
export function recordUnchanged(name: string) {
  mkdirSync(output, { recursive: true });
  writeFileSync(join(output, `${name}.json`), JSON.stringify({ reference: name, fullPageIdentical: true, changedPixels: 0 }, null, 2) + "\n");
}

export async function compareExtendedPage(page: Page, route: "/" | "/nosotros" | "/destinos", width: number, testInfo: TestInfo) {
  mkdirSync(output, { recursive: true });
  const name = `${route === "/" ? "inicio" : route.slice(1)}-${width}`;
  const expected = readFileSync(`tests/__screenshots__/chromium/${name}.png`);
  const current = await page.screenshot({ fullPage: true, animations: "disabled", timeout: 20_000 });
  writeFileSync(join(output, `${name}-actual.png`), current);
  const before = await sharp(expected).metadata();
  const after = await sharp(current).metadata();
  if (before.width !== after.width) throw new Error(`Cambió el ancho de ${name}`);
  const commonHeight = Math.min(before.height!, after.height!);
  const region = { left: 0, top: 0, width, height: commonHeight };
  const left = await sharp(expected).extract(region).ensureAlpha().raw().toBuffer();
  const right = await sharp(current).extract(region).ensureAlpha().raw().toBuffer();
  const diff = Buffer.alloc(left.length);
  let changedPixels = 0;
  for (let offset = 0; offset < left.length; offset += 4) {
    const changed = left[offset] !== right[offset] || left[offset + 1] !== right[offset + 1] || left[offset + 2] !== right[offset + 2] || left[offset + 3] !== right[offset + 3];
    if (changed) {
      changedPixels++;
    }
    const gray = Math.round((left[offset] + left[offset + 1] + left[offset + 2]) / 3 * 0.3 + 175);
    diff[offset] = changed ? 231 : gray;
    diff[offset + 1] = changed ? 98 : gray;
    diff[offset + 2] = changed ? 74 : gray;
    diff[offset + 3] = 255;
  }
  await sharp(diff, { raw: { width, height: commonHeight, channels: 4 } }).png().toFile(join(output, `${name}-diff.png`));
  const report = {
    reference: `${name}.png`, fullPageIdentical: false,
    expectedChange: route === "/nosotros" ? "Narrativa institucional agregada y rótulo de Ubicación retirado" : route === "/destinos" ? "Descripciones reales y campos comerciales condicionales bajo las postales" : "Retirada de los dos rótulos confirmada por el usuario",
    referenceHeight: before.height, currentHeight: after.height,
    changedPixelsInCommonArea: changedPixels, addedRows: after.height! - before.height!,
    legacyCompositionIdentical: false,
  };
  writeFileSync(join(output, `${name}.json`), JSON.stringify(report, null, 2) + "\n");
  await testInfo.attach("comparacion-original", { body: JSON.stringify(report, null, 2), contentType: "application/json" });
  return report;
}

export function recordNormalized(name: string, report: Awaited<ReturnType<typeof compareExtendedPage>>) {
  writeFileSync(join(output, `${name}.json`), JSON.stringify({ ...report, legacyCompositionIdentical: true, normalizedComparison: "Referencia original completa; máximo cero píxeles distintos según Playwright" }, null, 2) + "\n");
}

export async function normalizeAuthorizedChanges(page: Page, route: "/" | "/nosotros" | "/destinos") {
  // Test-only DOM normalization. Real captures/differences are saved first.
  // Source files and the 29 original baseline PNGs are never rewritten.
  await page.evaluate(route => {
    if (route === "/nosotros") document.querySelector("[data-agency-narrative]")?.remove();
    if (route === "/destinos") {
      document.querySelectorAll(".destination-details").forEach(element => element.remove());
      document.querySelectorAll(".destination-meta h2").forEach(element => {
        const heading = document.createElement("h3");
        heading.textContent = element.textContent;
        element.replaceWith(heading);
      });
    }
    if (route === "/") {
      const label = document.createElement("p");
      label.className = "section-index";
      label.textContent = "/ CADA VIAJE, UNA NUEVA HISTORIA";
      document.querySelector(".hero-copy")?.prepend(label);
    }
    if (route === "/" || route === "/nosotros") {
      const label = document.createElement("span");
      label.className = "section-index";
      label.textContent = "/ CERCA, ANTES DE IR LEJOS";
      document.querySelector("#encontranos")?.prepend(label);
    }
  }, route);
}
