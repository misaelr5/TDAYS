import { test, expect, routes, widths, ready } from "./fixtures";
import { compareExtendedPage, normalizeAuthorizedChanges, recordNormalized, recordUnchanged } from "./visual-comparison";

for (const route of routes) {
  for (const width of widths) {
    test(`referencia visual ${route} a ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await ready(page);
      if (route === "/" || route === "/nosotros" || route === "/destinos") {
        const comparison = await compareExtendedPage(page, route, width, testInfo);
        if (route !== "/") expect(comparison.addedRows).toBeGreaterThan(0);
        if (route === "/destinos") {
          const rotations = await page.locator(".destination-card .postcard").evaluateAll(elements => elements.map(element => {
            const matrix = new DOMMatrix(getComputedStyle(element).transform);
            return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
          }));
          for (const [index, angle] of [-8, 6, -3, 6, -8, -3, -8, 6].entries()) expect(rotations[index]).toBeCloseTo(angle, 2);
        }
        await normalizeAuthorizedChanges(page, route);
        await ready(page);
        const name = `${route === "/" ? "inicio" : route.slice(1)}-${width}`;
        await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, timeout: 20_000 });
        recordNormalized(name, comparison);
      } else {
        const name = `contacto-${width}`;
        await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, timeout: 20_000 });
        recordUnchanged(name);
      }
    });
  }
}

test("referencia visual del menú móvil", async ({ page }) => {
  await page.goto("/");
  await ready(page);
  await page.getByRole("button", { name: "Menú ＋" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveScreenshot("menu-390.png", { timeout: 20_000 });
  recordUnchanged("menu-390");
});
