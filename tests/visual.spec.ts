import { test, expect, routes, widths } from "./fixtures";
import { compareHistorical, prepareVisual } from "./visual-comparison";

for (const route of [...routes, "/terminos"]) {
  for (const width of widths) {
    test(`referencia visual ${route} a ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await prepareVisual(page);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      if (route === "/destinos") {
        await expect(page.locator("[data-destination-consultation]")).toHaveCount(8);
        await expect(page.locator("[data-destination-consultation] img")).toHaveCount(8);
      }
      const name = `${route === "/" ? "inicio" : route.slice(1)}-${width}`;
      await compareHistorical(name, await page.screenshot({ fullPage: true, animations: "disabled" }), testInfo);
      await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, timeout: 20_000 });
    });
  }
}

test("referencia visual del menú móvil", async ({ page }, testInfo) => {
  await page.goto("/");
  await prepareVisual(page);
  await page.getByRole("button", { name: "Menú ＋" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await compareHistorical("menu-390", await page.screenshot({ animations: "disabled" }), testInfo);
  await expect(page).toHaveScreenshot("menu-390.png", { timeout: 20_000 });
});
