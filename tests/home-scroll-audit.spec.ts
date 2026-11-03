import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

for (const width of [320, 390, 768, 1440, 1857]) {
  test(`Inicio: espaciado, decoración y accesibilidad a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator("[data-scenic-hero]");
    const destinations = page.locator("#destinos");
    expect(await hero.evaluate(el => getComputedStyle(el).backgroundColor)).toBe(await destinations.evaluate(el => getComputedStyle(el).backgroundColor));
    const bandBox = (await page.locator("[data-trust-cards]").boundingBox())!;
    const heroBox = (await hero.boundingBox())!;
    expect(heroBox.y + heroBox.height - bandBox.y - bandBox.height).toBeGreaterThanOrEqual(23.5); // sub-pixel layout in Firefox
    const plane = destinations.locator('[data-sticker="plane"]');
    if (width > 1100) {
      const decoration = (await plane.boundingBox())!;
      const section = (await destinations.boundingBox())!;
      expect(decoration.y).toBeGreaterThanOrEqual(section.y);
      expect(decoration.x + decoration.width + 8).toBeLessThanOrEqual((await destinations.getByRole("link", { name: "Ver todos los destinos" }).boundingBox())!.x);
      expect(decoration.x).toBeGreaterThan((await destinations.locator("h2").boundingBox())!.x + (await destinations.locator("h2").boundingBox())!.width);
    } else await expect(plane).toBeHidden();
    const services = page.locator("#consulta");
    await services.scrollIntoViewIfNeeded();
    const title = services.locator("h2");
    const pin = services.locator('[data-sticker="pin"]');
    const pinRect = (await pin.boundingBox())!;
    const lines = await title.evaluate(el => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return [...range.getClientRects()].filter(r => r.width > 1).map(r => ({ left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
    });
    expect(lines.every(r => r.right <= pinRect.x || r.left >= pinRect.x + pinRect.width || r.bottom <= pinRect.y || r.top >= pinRect.y + pinRect.height)).toBe(true);
    if (width >= 768 && width <= 1000) {
      const arrows = await services.locator("li a > span").evaluateAll(els => els.map(el => el.getBoundingClientRect().top));
      expect(Math.max(...arrows) - Math.min(...arrows)).toBeLessThan(1);
      const intro = services.locator("h2 + p");
      expect((await intro.boundingBox())!.y).toBeGreaterThan((await title.boundingBox())!.y + (await title.boundingBox())!.height);
    }
    const gaps = await page.evaluate(() => {
      const bottom = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().bottom;
      const top = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().top;
      return [top('#egresados h2') - bottom('#destinos'), top('#consulta h2') - bottom('#egresados')];
    });
    expect(gaps.every(gap => gap >= 24)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).include("main").include("footer").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  });
}

test("Entradas suaves: una vez por recorrido, foco y preferencia de movimiento", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const intro = page.locator('#consulta [data-soft-reveal]').first();
  await expect(intro).toHaveAttribute("data-reveal", "pending");
  await intro.scrollIntoViewIfNeeded();
  await expect(intro).toHaveAttribute("data-reveal", "visible");
  await expect(intro).toHaveCSS("animation-duration", "0.42s");
  await page.locator("h1").scrollIntoViewIfNeeded();
  await expect(intro).toHaveAttribute("data-reveal", "visible");
  const china = page.locator('#turismo-chino [data-soft-reveal]');
  await china.getByRole("link").focus();
  await expect(china).toHaveCSS("opacity", "1");
  await expect(china).toHaveCSS("animation-name", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(intro).toHaveCSS("opacity", "1");
  await expect(intro).toHaveCSS("animation-name", "none");
});

test("Entradas suaves: nuevas rutas y texto sin JavaScript", async ({ page, browser, baseURL }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.locator('#consulta [data-soft-reveal]').first().scrollIntoViewIfNeeded();
  await page.locator('#destinos a[href="/destinos"]').click();
  const card = page.locator('.destination-card[data-soft-reveal]').last();
  await expect(card).toHaveAttribute("data-reveal", /pending|visible/);
  await expect(page.locator("h1").locator("..")).toHaveCSS("opacity", "1");
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute("data-reveal", "visible");
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "no-preference" });
  try {
    const fallback = await context.newPage();
    await fallback.goto("/");
    for (const block of await fallback.locator('[data-soft-reveal]').all()) {
      await expect(block).toHaveCSS("opacity", "1");
      await expect(block).not.toHaveAttribute("data-reveal", "pending");
    }
  } finally { await context.close(); }
});
