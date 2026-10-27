import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

const categories = [
  { id: "primaria", label: "Primaria", cta: "Consultar por primaria", message: "egresados de primaria" },
  { id: "secundaria", label: "Secundaria", cta: "Consultar por secundaria", message: "egresados de secundaria" },
  { id: "maestros", label: "Maestros", cta: "Consultar por El Maestrazo", message: "grupo de docentes" },
] as const;

for (const route of ["/", "/destinos"]) {
  for (const width of [320, 390, 768, 1440]) {
    test(`Viajes escolares: categorías, altura, consultas y accesibilidad en ${route} a ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      const section = page.locator("#egresados");
      const tabs = section.getByRole("tablist", { name: "Categorías de viajes escolares" });
      await expect(tabs.getByRole("tab")).toHaveText(categories.map(item => item.label));
      await expect(section).toContainText("Viajes escolares");
      await section.scrollIntoViewIfNeeded();
      const initialHeight = (await section.boundingBox())!.height;
      for (const category of categories) {
        const tab = tabs.getByRole("tab", { name: category.label, exact: true });
        await tab.click();
        await expect(tab).toHaveAttribute("aria-selected", "true");
        const panel = section.getByRole("tabpanel");
        await expect(panel).toHaveCount(1);
        await expect(panel).toHaveAttribute("data-level", category.id);
        const link = panel.getByRole("link", { name: category.cta, exact: true });
        await expect(link).toBeVisible();
        const url = new URL((await link.getAttribute("href"))!);
        expect(url.origin + url.pathname).toBe("https://wa.me/5493544312904");
        expect(url.searchParams.get("text")).toContain(category.message);
        expect(Math.abs((await section.boundingBox())!.height - initialHeight)).toBeLessThanOrEqual(1);
        await page.keyboard.press("Tab");
        await tab.focus();
        expect(await tab.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
        const box = (await tab.boundingBox())!;
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        const axe = await new AxeBuilder({ page }).include("#egresados").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
        expect(axe.violations).toEqual([]);
        if (category.id === "maestros") {
          const photo = panel.getByRole("img");
          await photo.scrollIntoViewIfNeeded();
          await expect(photo).toHaveAttribute("alt", /Grupo de pasajeros de El Maestrazo/);
          await expect.poll(() => photo.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)).toBe(true);
          expect(await photo.evaluate(element => getComputedStyle(element).objectFit)).toBe("contain");
          await section.screenshot({ path: testInfo.outputPath(`escolares-${route === "/" ? "inicio" : "destinos"}-maestros-${width}.png`), animations: "disabled", style: ".site-header { visibility: hidden !important; }" });
        }
      }
      await tabs.getByRole("tab", { name: "Maestros", exact: true }).focus();
      await page.keyboard.press("ArrowRight");
      await expect(tabs.getByRole("tab", { name: "Primaria", exact: true })).toBeFocused();
      await page.keyboard.press("End");
      await expect(tabs.getByRole("tab", { name: "Maestros", exact: true })).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("Home");
      await expect(tabs.getByRole("tab", { name: "Primaria", exact: true })).toHaveAttribute("aria-selected", "true");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(section.locator("video")).toHaveCount(0);
      expect(await section.locator("img").evaluateAll(images => images.some(image => decodeURIComponent(image.getAttribute("src") ?? "").includes("/pending/")))).toBe(false);
      await expect(page.locator(route === "/" ? "[data-destination-preview]" : ".destination-card")).toHaveCount(8);
    });
  }

  test(`Viajes escolares: las tres categorías y enlace ampliado funcionan sin JS en ${route}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 640, height: 1000 } });
    try {
      const page = await context.newPage();
      await page.goto(route);
      const section = page.locator("#egresados");
      const nav = section.getByRole("navigation", { name: "Categorías de viajes escolares" });
      for (const category of categories) {
        await nav.getByRole("link", { name: category.label, exact: true }).click();
        await expect(section.locator(`[data-level="${category.id}"]`)).toBeVisible();
        await expect(section.getByRole("link", { name: category.cta, exact: true })).toBeVisible();
      }
      if (route === "/") {
        await section.getByRole("link", { name: "Conocer El Maestrazo", exact: true }).click();
        await expect(page).toHaveURL(/\/destinos\?escolar=maestros#escolares-maestros$/);
        await expect(page.locator("#escolares-maestros")).toBeVisible();
      }
      await page.locator("body").evaluate(element => { element.style.zoom = "2"; });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    } finally { await context.close(); }
  });
}

test("Inicio abre la misma categoría en Destinos y el historial recupera la selección", async ({ page }) => {
  for (const category of categories) {
    await page.goto("/");
    const section = page.locator("#egresados");
    await section.getByRole("tab", { name: category.label, exact: true }).click();
    await section.getByRole("link", { name: /^Conocer / }).click();
    await expect(page).toHaveURL(new RegExp(`/destinos\\?escolar=${category.id}#escolares-${category.id}$`));
    await expect(page.locator("#egresados").getByRole("tab", { name: category.label, exact: true })).toHaveAttribute("aria-selected", "true");
  }
  const tabs = page.locator("#egresados").getByRole("tablist");
  await tabs.getByRole("tab", { name: "Primaria", exact: true }).click();
  await page.goBack();
  await expect(tabs.getByRole("tab", { name: "Maestros", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.goForward();
  await expect(tabs.getByRole("tab", { name: "Primaria", exact: true })).toHaveAttribute("aria-selected", "true");
});

test("Enlace directo, categoría inválida y reduced motion conservan un panel utilizable", async ({ page }) => {
  await page.goto("/destinos#escolares-maestros");
  const section = page.locator("#egresados");
  await expect(section.getByRole("tab", { name: "Maestros", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(section.getByRole("tabpanel")).toBeInViewport();
  expect(await section.getByRole("tabpanel").evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  await page.goto("/destinos?escolar=inexistente#egresados");
  await expect(section.getByRole("tab", { name: "Primaria", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(section.getByRole("tabpanel")).toHaveCount(1);
});
