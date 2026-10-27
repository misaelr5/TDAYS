import AxeBuilder from "@axe-core/playwright";
import { test, expect, ready } from "./fixtures";

for (const width of [320, 768, 1440]) {
  test(`Turismo chino a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await ready(page);
    const section = page.locator("#turismo-chino");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText("Traslasierra recibe al turismo chino.");
    const url = new URL((await section.getByRole("link").getAttribute("href"))!);
    expect(url.searchParams.get("text")).toContain("turismo receptivo desde China");
    const axe = await new AxeBuilder({ page }).include("#turismo-chino").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
