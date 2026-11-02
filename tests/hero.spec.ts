import { mkdirSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { test, expect, widths, ready } from "./fixtures";

for (const width of widths) {
  test(`hero de paisaje: composición, consulta y captura a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await ready(page);
    const hero = page.locator("[data-scenic-hero]");
    const bounds = await hero.boundingBox();
    expect(bounds!.x).toBe(0);
    expect(bounds!.y).toBe(0);
    expect(bounds!.width).toBe(width);
    await expect(hero.getByRole("heading", { level: 1 })).toHaveText("Egresados de primaria y secundaria");
    const titleLines = await hero.locator("h1 > span").first().evaluate(element => {
      const text = [...element.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
      const range = document.createRange();
      range.selectNodeContents(text!);
      return [...range.getClientRects()].filter(rect => rect.width > 1 && rect.height > 1).length;
    });
    expect(titleLines, "Egresados debe ocupar un solo renglón al tamaño de lectura normal").toBe(1);
    await expect(hero.getByRole("form", { name: "Prepará tu consulta de viaje" })).toBeVisible();
    const cards = hero.locator("[data-trust-card]");
    await expect(cards).toHaveCount(4);
    await expect(cards.nth(0)).toContainText("+23 años");
    await expect(cards.nth(0)).toContainText("Experiencia en turismo");
    await expect(cards.nth(1)).toContainText("N.º 18904");
    await expect(cards.nth(2)).toContainText("En turismo estudiantil habilitado en Traslasierra");
    await expect(cards.nth(2)).not.toContainText("Afirmación sujeta al respaldo documental");
    await expect(cards.nth(3)).toContainText("Atención personalizada en Villa Dolores");
    const columns = await hero.locator("[data-trust-cards]").evaluate(element => getComputedStyle(element).gridTemplateColumns.split(" ").length);
    expect(columns).toBe(width > 1100 ? 4 : width >= 600 ? 2 : 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await hero.getByRole("button", { name: "Consultar", exact: true }).focus();
    expect(await hero.getByRole("button", { name: "Consultar", exact: true }).evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
    await page.locator("h1").click();
    mkdirSync("output/playwright/scenic", { recursive: true });
    await hero.screenshot({ path: `output/playwright/scenic/hero-${width}.png`, animations: "disabled" });
  });
}

test("viajeros conserva foco y Escape con controles deshabilitados", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /^Viajeros/ });
  const panel = page.getByRole("dialog", { name: "Cantidad de viajeros" });
  await trigger.click();
  await expect(panel.getByRole("button", { name: "Sumar una persona" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await panel.getByRole("switch", { name: /Viajamos en grupo/ }).click();
  await expect(panel.getByRole("switch")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("navbar transparente con vidrio sobre el paisaje y al bajar, accesible", async ({ page }) => {
  await page.goto("/");
  await ready(page);
  const header = page.locator(".site-header");
  expect(await header.evaluate(element => getComputedStyle(element).position)).toBe("fixed");
  expect(await header.evaluate(element => getComputedStyle(element).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
  expect((await new AxeBuilder({ page }).include(".site-header").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.evaluate(() => window.scrollTo({ top: 120, behavior: "instant" }));
  await expect(header).toHaveClass(/header-solid/);
  // Liquid glass: the bar stays transparent; the navigation pill carries the tinted glass.
  expect(await header.evaluate(element => getComputedStyle(element).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
  const reducedTransparency = await page.evaluate(() => matchMedia("(prefers-reduced-transparency: reduce)").matches || matchMedia("(prefers-contrast: more)").matches);
  const backdrop = await header.locator("nav").evaluate(element => getComputedStyle(element).backdropFilter);
  if (reducedTransparency) expect(backdrop).toBe("none");
  else expect(backdrop).toContain("blur");
  expect((await new AxeBuilder({ page }).include(".site-header").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(header).not.toHaveClass(/header-solid/);
  await page.goto("/contacto");
  await expect(header).toHaveClass(/header-solid/);
});

test("consulta del hero prepara WhatsApp con los datos elegidos e invalida el borrador al editar", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("[data-scenic-hero]");
  await hero.getByRole("combobox", { name: /Destino o tipo de viaje/ }).click();
  await hero.getByRole("option", { name: /Egresados/ }).click();
  await expect(hero.getByRole("combobox", { name: /Destino o tipo de viaje/ })).toContainText("Egresados");
  await hero.getByRole("button", { name: /Fecha aproximada/ }).click();
  const calendar = hero.getByRole("dialog", { name: "Elegí una fecha aproximada" });
  for (let step = 0; step < 60 && !(await calendar.getByText("septiembre de 2027").isVisible()); step++) await calendar.getByRole("button", { name: "Mes siguiente" }).click();
  await calendar.getByRole("button", { name: /12 de septiembre de 2027/ }).click();
  await expect(calendar).toHaveCount(0);
  await hero.getByRole("button", { name: /^Viajeros/ }).click();
  await hero.getByRole("switch", { name: /Viajamos en grupo/ }).click();
  await hero.getByRole("button", { name: "Listo" }).click();
  await hero.getByRole("button", { name: "Consultar", exact: true }).click();
  const draft = hero.getByRole("status").filter({ hasText: "Tu consulta está lista" });
  await expect(draft).toBeFocused();
  const url = new URL((await draft.getByRole("link", { name: "Abrir WhatsApp" }).getAttribute("href"))!);
  expect(url.origin + url.pathname).toBe("https://wa.me/5493544312904");
  expect(url.searchParams.get("text")).toContain("Egresados");
  expect(url.searchParams.get("text")).toContain("12/09/2027");
  expect(url.searchParams.get("text")).toContain("Viajamos en grupo.");
  expect((await new AxeBuilder({ page }).include("[data-scenic-hero]").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await hero.getByRole("button", { name: /^Viajeros/ }).click();
  await hero.getByRole("switch", { name: /Viajamos en grupo/ }).click();
  await expect(draft).toHaveCount(0);
  await hero.getByRole("button", { name: "Sumar una persona" }).click();
  await hero.getByRole("button", { name: "Sumar una persona" }).click();
  await page.keyboard.press("Escape");
  await expect(hero.getByRole("button", { name: /^Viajeros/ })).toContainText("2 personas");
  await expect(hero.getByRole("button", { name: /^Viajeros/ })).toBeFocused();
});

test("sin JavaScript el hero ofrece consulta directa y el footer enlaza las cuatro rutas", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const hero = page.locator("[data-scenic-hero]");
    await expect(hero.getByRole("form")).toBeHidden();
    await expect(hero.getByRole("link", { name: "Consultá por tu viaje", exact: true })).toHaveAttribute("href", "/contacto#consulta");
    await hero.getByRole("link", { name: "Conocé los viajes de egresados", exact: true }).click();
    await expect(page).toHaveURL(/\/#egresados$/);
    for (const href of ["/", "/destinos", "/nosotros", "/contacto"]) await expect(page.locator(`footer a[href="${href}"]`).first()).toBeVisible();
  } finally { await context.close(); }
});
