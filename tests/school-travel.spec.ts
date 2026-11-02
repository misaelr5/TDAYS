import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

const categories = [
  { id: "primaria", label: "Primaria", cta: "Consultar por primaria", message: "egresados de primaria" },
  { id: "secundaria", label: "Secundaria", cta: "Consultar por secundaria", message: "egresados de secundaria" },
  { id: "maestros", label: "El Maestrazo.", cta: "Consultar por El Maestrazo", message: "grupo de docentes" },
] as const;

for (const route of ["/", "/destinos"]) {
  test(`Egresados: los accesos para familias abren su respuesta desde ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    for (const [label, id] of [["Cómo empezar", "egresados-inicio"], ["Acompañamiento", "egresados-acompanamiento"], ["Antes de contratar", "egresados-contratacion"]]) {
      await page.goto(route);
      await page.locator('aside[aria-labelledby="graduates-families-title"]').getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/destinos#${id}$`));
      const answer = page.locator(`#${id}`);
      await expect(answer).toBeVisible();
      await expect(answer).toBeInViewport();
      await expect(page.getByRole("navigation", { name: "Temas de la guía de viajes escolares" }).getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "location");
    }
  });

  for (const width of [320, 390, 768, 1440]) {
    test(`Egresados: propuestas visibles, consultas y accesibilidad en ${route} a ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      const section = page.locator("#egresados");
      await expect(section.getByRole("heading", { name: "Egresados.", exact: true })).toBeVisible();
      const heading = section.locator("#graduates-title");
      await expect(heading).toHaveCSS("text-transform", "uppercase");
      expect(await heading.evaluate(element => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return [...range.getClientRects()].filter(rect => rect.width > 1).length;
      })).toBe(1);
      await expect(section.getByRole("tablist")).toHaveCount(0);
      for (const category of categories) {
        const proposal = section.locator(`[data-level="${category.id}"]`);
        await expect(proposal).toBeVisible();
        const consultation = proposal.getByRole("link", { name: category.cta, exact: true });
        const target = new URL((await consultation.getAttribute("href"))!);
        expect(target.origin + target.pathname).toBe("https://wa.me/5493544312904");
        expect(target.searchParams.get("text")).toContain(category.message);
        await consultation.focus();
        expect(await consultation.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
        expect((await consultation.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        const photo = proposal.locator("picture img");
        await photo.scrollIntoViewIfNeeded();
        await expect(photo).toHaveAttribute("alt", category.id === "maestros" ? /Grupo de El Maestrazo/ : "");
        await expect.poll(() => photo.evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
        expect(await photo.getAttribute("src")).toContain(category.id === "maestros" ? "maestrazo-fiesta" : category.id === "primaria" ? "primaria-compact" : "secundaria-loop");
      }
      const primary = (await section.locator('[data-level="primaria"]').boundingBox())!;
      const secondary = (await section.locator('[data-level="secundaria"]').boundingBox())!;
      const primaryMedia = (await section.locator('[data-level="primaria"] figure').boundingBox())!;
      const secondaryMedia = (await section.locator('[data-level="secundaria"] figure').boundingBox())!;
      expect(Math.abs(primaryMedia.height - secondaryMedia.height)).toBeLessThan(1);
      expect(Math.abs(primaryMedia.width - secondaryMedia.width)).toBeLessThan(1);
      if (width >= 768) { expect(Math.abs(primary.y - secondary.y)).toBeLessThan(1); expect(Math.abs(primary.height - secondary.height)).toBeLessThan(1); expect(secondary.x).toBeGreaterThan(primary.x); }
      else expect(secondary.y).toBeGreaterThanOrEqual(primary.y + primary.height);
      const axe = await new AxeBuilder({ page }).include("#egresados").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(axe.violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(section.locator("video")).toHaveCount(2);
      for (const video of await section.locator("video").all()) await expect(video).not.toHaveAttribute("src");
      await expect(page.locator(route === "/" ? "[data-destination-preview]" : ".destination-card")).toHaveCount(8);
      await section.screenshot({ path: testInfo.outputPath(`egresados-${route === "/" ? "inicio" : "destinos"}-${width}.png`), animations: "disabled", style: ".site-header { visibility:hidden !important; }" });
    });
  }

  test(`Egresados: las tres propuestas funcionan sin JS y con zoom en ${route}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 640, height: 1000 } });
    try {
      const page = await context.newPage();
      await page.goto(route);
      const section = page.locator("#egresados");
      for (const category of categories) await expect(section.getByRole("link", { name: category.cta, exact: true })).toBeVisible();
      if (route === "/") {
        await section.getByRole("link", { name: "Conocer la propuesta de secundaria", exact: true }).click();
        await expect(page).toHaveURL(/\/destinos\?escolar=secundaria#escolares-secundaria$/);
        await expect(page.locator("#escolares-secundaria")).toBeInViewport();
      }
      await page.locator("body").evaluate(element => { element.style.zoom = "2"; });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    } finally { await context.close(); }
  });
}

for (const width of [390, 1440]) {
  test(`Egresados: entrada al hacer scroll, teclado y movimiento reducido a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const primary = page.locator('#egresados [data-level="primaria"]');
    await expect(primary).toHaveAttribute("data-reveal", "pending");
    await primary.scrollIntoViewIfNeeded();
    await expect(primary).toHaveAttribute("data-reveal", "visible");
    expect(await primary.evaluate(element => getComputedStyle(element).animationName)).not.toBe("none");
    // It remains revealed when leaving and returning to the viewport.
    await page.locator("h1").scrollIntoViewIfNeeded();
    await expect(primary).toHaveAttribute("data-reveal", "visible");
    const consultation = primary.getByRole("link", { name: "Consultar por primaria", exact: true });
    await consultation.focus();
    await expect(consultation).toBeInViewport();
    await expect(primary).toHaveCSS("opacity", "1");
    await expect(primary).toHaveCSS("animation-name", "none");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await expect(primary).toHaveCSS("opacity", "1");
    await expect(primary).toHaveCSS("animation-name", "none");
  });
}

test("Egresados: cada enlace de Inicio abre su propuesta, con historial y recarga", async ({ page }) => {
  for (const category of categories) {
    await page.goto("/");
    await page.locator(`[data-level="${category.id}"]`).getByRole("link", { name: /^Conocer / }).click();
    await expect(page).toHaveURL(new RegExp(`/destinos\\?escolar=${category.id}#escolares-${category.id}$`));
    await expect(page.locator(`#escolares-${category.id}`)).toBeInViewport();
    await page.reload();
    await expect(page.locator(`#escolares-${category.id}`)).toBeInViewport();
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
  }
});
