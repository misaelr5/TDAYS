import AxeBuilder from "@axe-core/playwright";
import { training } from "../src/features/agency/data";
import { test, expect, ready } from "./fixtures";

const topics = [
  { id: "egresados-inicio", label: "Cómo empezar" },
  { id: "egresados-destinos", label: "Destinos y fechas" },
  { id: "egresados-contratacion", label: "Antes de contratar" },
  { id: "egresados-acompanamiento", label: "Acompañamiento" },
] as const;

for (const width of [375, 768, 1440]) {
  test(`Guía de Egresados: categorías, teclado, consulta por nivel y accesibilidad a ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/destinos");
    await ready(page);
    const section = page.locator("#egresados");
    const guide = section.locator("[data-graduates-guide]");
    const nav = guide.getByRole("navigation", { name: "Temas de la guía de egresados" });
    await expect(guide.getByRole("heading", { level: 3 })).toHaveText("Organizamos el viaje con ustedes.");
    await expect(nav.getByRole("link")).toHaveCount(4);
    await expect(guide.locator("ol > li")).toHaveCount(3);
    await expect(guide.locator("h5")).toHaveText(["Contanos del grupo", "Conversemos el viaje", "Revisemos la propuesta"]);
    await expect(guide).toContainText("23 años de experiencia de Javier Garay");
    for (const topic of topics) {
      const link = nav.getByRole("link", { name: topic.label, exact: true });
      await link.focus();
      const scrollBefore = await page.evaluate(() => scrollY);
      await page.keyboard.press("Enter");
      await expect(link).toHaveAttribute("aria-current", "location");
      await expect(page).toHaveURL(new RegExp(`#${topic.id}$`));
      expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
      await expect(guide.locator(`#${topic.id}`)).toBeVisible();
      for (const other of topics.filter(item => item.id !== topic.id)) await expect(guide.locator(`#${other.id}`)).toBeHidden();
      const axe = await new AxeBuilder({ page }).include("[data-graduates-guide]").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(axe.violations).toEqual([]);
    }
    const accompaniment = guide.locator("#egresados-acompanamiento");
    await expect(accompaniment.locator("li")).toHaveText([...training]);
    await expect(accompaniment).toContainText("asistencia paramédica");
    const disclosure = accompaniment.locator("details");
    await disclosure.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(disclosure.locator("ul")).toBeHidden();
    await page.keyboard.press("Space");
    await expect(disclosure.locator("ul")).toBeVisible();
    await nav.getByRole("link", { name: "Antes de contratar", exact: true }).click();
    await expect(guide.locator("#egresados-contratacion")).toContainText("pago y cancelación");
    for (const level of ["Primaria", "Secundaria"]) {
      await section.getByRole("radio", { name: level, exact: true }).check();
      const link = guide.getByRole("link", { name: "Consultar por nuestro grupo", exact: true });
      await expect(link).toHaveCount(1);
      const url = new URL((await link.getAttribute("href"))!);
      expect(url.origin + url.pathname).toBe("https://wa.me/5493544312904");
      expect(url.searchParams.get("text")).toContain(`egresados de ${level.toLowerCase()}`);
      await page.keyboard.press("Tab");
      await link.focus();
      expect(await link.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await nav.getByRole("link", { name: "Cómo empezar", exact: true }).click();
    await guide.screenshot({ path: testInfo.outputPath(`ayuda-${width}.png`), animations: "disabled", style: ".site-header { visibility: hidden !important; }" });
    await guide.getByRole("link", { name: "Volver a los niveles" }).click();
    await expect(page).toHaveURL(/#egresados$/);
    await expect(section.getByRole("radio", { name: "Secundaria", exact: true })).toBeChecked();
  });
}

test("Guía de Egresados: categorías y consulta funcionan sin JavaScript al 200%", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 640, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto("/destinos#egresados-preguntas");
    const guide = page.locator("[data-graduates-guide]");
    await expect(guide.locator("#egresados-preguntas")).toBeInViewport();
    await page.locator("body").evaluate(element => { element.style.zoom = "2"; });
    await page.locator("#egresados").getByRole("radio", { name: "Secundaria", exact: true }).check();
    await expect(guide.getByRole("link", { name: "Consultar por nuestro grupo" })).toHaveAttribute("href", /egresados%20de%20secundaria/);
    const nav = guide.getByRole("navigation", { name: "Temas de la guía de egresados" });
    for (const topic of topics) {
      await nav.getByRole("link", { name: topic.label, exact: true }).click();
      await expect(guide.locator(`#${topic.id}`)).toBeVisible();
      for (const other of topics.filter(item => item.id !== topic.id)) await expect(guide.locator(`#${other.id}`)).toBeHidden();
    }
    const trainingQuestion = guide.locator("#egresados-acompanamiento details");
    await trainingQuestion.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(trainingQuestion.locator("ul")).toBeHidden();
    await page.keyboard.press("Space");
    await expect(trainingQuestion.locator("ul")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { await context.close(); }
});

test("Guía de Egresados: enlaces directos y navegación Atrás/Adelante conservan la categoría", async ({ page }) => {
  await page.goto("/destinos#egresados-contratacion");
  const guide = page.locator("[data-graduates-guide]");
  const nav = guide.getByRole("navigation", { name: "Temas de la guía de egresados" });
  await expect(guide.locator("#egresados-contratacion")).toBeVisible();
  await expect(nav.getByRole("link", { name: "Antes de contratar", exact: true })).toHaveAttribute("aria-current", "location");
  await nav.getByRole("link", { name: "Destinos y fechas", exact: true }).click();
  await nav.getByRole("link", { name: "Acompañamiento", exact: true }).click();
  await page.goBack();
  await expect(page).toHaveURL(/#egresados-destinos$/);
  await expect(guide.locator("#egresados-destinos")).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/#egresados-acompanamiento$/);
  await expect(guide.locator("#egresados-acompanamiento")).toBeVisible();
});
