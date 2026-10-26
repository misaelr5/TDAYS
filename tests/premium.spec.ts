import { test, expect } from "./fixtures";

for (const route of ["/", "/destinos"]) {
  for (const width of [390, 1440]) {
    test(`Egresados: selección explícita y consulta específica en ${route} a ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const section = page.locator("#egresados");
      const primary = section.getByRole("radio", { name: "Primaria", exact: true });
      const secondary = section.getByRole("radio", { name: "Secundaria", exact: true });
      await expect(primary).toBeChecked();
      await secondary.check();
      await expect(section.locator('[data-level="secundaria"]')).toBeVisible();
      await expect(section.locator('[data-level="primaria"]')).toBeHidden();
      const link = section.getByRole("link", { name: "Consultar por secundaria" });
      const url = new URL((await link.getAttribute("href"))!);
      expect(url.pathname).toBe("/5493544312904");
      expect(url.searchParams.get("text")).toContain("secundaria");
      await primary.hover();
      await expect(secondary).toBeChecked();
      await secondary.focus();
      await page.keyboard.press("ArrowLeft");
      await expect(primary).toBeChecked();
      await expect(section.locator('[data-level="primaria"]')).toBeVisible();
      expect(await primary.locator("..").evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator("main img").evaluateAll(images => images.filter(image => decodeURIComponent(image.getAttribute("src") ?? "").includes("/team/")).length)).toBe(0);
      await expect(page.locator("video")).toHaveCount(0);
    });
  }

  test(`Egresados funciona sin JavaScript en ${route}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    try {
      const page = await context.newPage();
      await page.goto(route);
      const section = page.locator("#egresados");
      await section.getByRole("radio", { name: "Secundaria", exact: true }).check();
      await expect(section.getByRole("link", { name: "Consultar por secundaria" })).toBeVisible();
      await section.getByRole("radio", { name: "Primaria", exact: true }).check();
      await expect(section.getByRole("link", { name: "Consultar por primaria" })).toBeVisible();
    } finally { await context.close(); }
  });
}

test("los accesos locales llevan a Egresados y a los capítulos de Nosotros", async ({ page }) => {
  await page.goto("/destinos");
  await page.getByRole("navigation", { name: "Elegí tu tipo de viaje" }).getByRole("link").click();
  await expect(page).toHaveURL(/#egresados$/);
  await expect(page.getByRole("group", { name: "Elegí el nivel de tu grupo" })).toBeInViewport();
  await page.goto("/nosotros");
  await page.getByRole("navigation", { name: "Conocé la agencia" }).getByRole("link", { name: "El equipo" }).click();
  await expect(page).toHaveURL(/#equipo$/);
  await expect(page.locator("#equipo")).toBeInViewport();
});
