import AxeBuilder from "@axe-core/playwright";
import { test, expect, ready } from "./fixtures";

for (const width of [375, 768, 1440]) {
  test(`Home inferior: recorrido, niveles, contactos y accesibilidad a ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await ready(page);
    const graduates = page.locator("#egresados");
    const services = page.locator("#consulta");
    const positions = await page.locator("#destinos, #egresados, #consulta, footer").evaluateAll(elements => elements.map(element => ({ id: element.id, top: element.getBoundingClientRect().top, bottom: element.getBoundingClientRect().bottom })));
    expect(positions.map(position => position.id)).toEqual(["destinos", "egresados", "consulta", "navegacion"]);
    for (let index = 1; index < positions.length; index++) {
      expect(Math.abs(positions[index].top - positions[index - 1].bottom)).toBeLessThanOrEqual(1);
    }
    await expect(services.getByRole("heading", { level: 3 })).toHaveCount(4);
    const messages = ["turismo nacional o internacional", "viaje educativo", "turismo receptivo"];
    const links = services.getByRole("link", { name: /^Consultar por .* en WhatsApp$/ });
    await expect(links).toHaveCount(3);
    for (let index = 0; index < messages.length; index++) {
      const url = new URL((await links.nth(index).getAttribute("href"))!);
      expect(url.origin + url.pathname).toBe("https://wa.me/5493544312904");
      expect(url.searchParams.get("text")).toContain(messages[index]);
    }
    await expect(services.getByRole("img")).toHaveAttribute("alt", /oficina de Travel Days/);
    await expect(services.locator("address")).toHaveText("Felipe Erdman 222, Villa Dolores, Córdoba");
    await expect(services).toContainText("2018");
    await expect(services).toContainText("23 años");
    for (const level of ["Primaria", "Secundaria"]) {
      const radio = graduates.getByRole("radio", { name: level, exact: true });
      await radio.check();
      await page.keyboard.press("Tab");
      await radio.focus();
      expect(await radio.locator("..").evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
      await expect(graduates.locator(`[data-level="${level.toLowerCase()}"]`)).toBeVisible();
      await expect(graduates.getByRole("link", { name: /^Consultar por/ })).toHaveCount(1);
      const axe = await new AxeBuilder({ page }).include("#egresados").include("#consulta").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(axe.violations).toEqual([]);
      await graduates.screenshot({ path: testInfo.outputPath(`egresados-${level.toLowerCase()}-${width}.png`), animations: "disabled", style: ".site-header { visibility: hidden !important; }" });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await services.getByRole("link", { name: "Ver ubicación y horarios" }).click();
    await expect(page).toHaveURL(/\/contacto#oficina$/);
    await expect(page.locator("#oficina")).toBeVisible();
    await page.goto("/");
    await page.locator("#consulta").getByRole("link", { name: "Conocé nuestra historia" }).click();
    await expect(page).toHaveURL(/\/nosotros#historia$/);
    await expect(page.locator("#historia")).toBeVisible();
  });
}

test("Home inferior: selección con teclado sin JavaScript y reflow a 200%", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 640, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const section = page.locator("#egresados");
    await section.getByRole("radio", { name: "Primaria", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(section.getByRole("radio", { name: "Secundaria", exact: true })).toBeChecked();
    await expect(section.getByRole("link", { name: "Consultar por secundaria" })).toBeVisible();
    await page.locator("body").evaluate(element => { element.style.zoom = "2"; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await section.getByRole("link", { name: "Ver preguntas frecuentes" }).click();
    await expect(page).toHaveURL(/\/destinos#egresados-preguntas$/);
  } finally { await context.close(); }
});
