import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";
import { publicOrigin } from "../src/config/seo";

test("las URLs verificadas de la web anterior conservan su destino y consulta", async ({ request }) => {
  for (const [source, target] of [["/index.html", "/"], ["/turismojoven.html", "/turismo-joven"], ["/nacionales.html", "/destinos"], ["/internacionales.html", "/destinos"]]) {
    const response = await request.get(`${source}?origen=anterior`, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(`${publicOrigin}${target}?origen=anterior`);
  }
  expect((await request.get("/pagina-inexistente-seo", { maxRedirects: 0 })).status()).toBe(404);
});

test("turismo joven es legible sin JavaScript y contiene enlaces y consultas reales", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/turismo-joven`);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("Turismo joven");
  await expect(page.getByRole("heading", { name: "¿Los destinos publicados tienen salida o precio confirmado?" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Consultar por turismo joven", exact: true })).toHaveAttribute("href", /wa\.me\/5493544312904/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("turismo joven mantiene accesibilidad y migas de navegación coherentes", async ({ page }) => {
  await page.goto("/turismo-joven");
  const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap(text => {
    const entity = JSON.parse(text);
    return entity["@graph"] ?? [entity];
  });
  const breadcrumb = schemas.find(entity => entity["@type"] === "BreadcrumbList");
  expect(breadcrumb.itemListElement[1].item).toBe(`${publicOrigin}/turismo-joven`);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations).toEqual([]);
  }
});
