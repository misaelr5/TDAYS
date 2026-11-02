import AxeBuilder from "@axe-core/playwright";
import { test, expect, routes, ready } from "./fixtures";
import { indexingEnabled, publicUrl } from "../src/config/seo";

for (const transparency of ["reduce", "no-preference"] as const) {
  for (const width of [390, 1440]) {
    test(`catálogo con transparencia ${transparency}: contraste y captura a ${width}px`, async ({ page, browserName }, testInfo) => {
      test.skip(browserName !== "chromium", "Emulación de transparencia mediante CDP exclusiva de Chromium; Axe general se prueba en los tres motores.");
      await page.setViewportSize({ width, height: 900 });
      const session = await page.context().newCDPSession(page);
      await session.send("Emulation.setEmulatedMedia", { features: [
        { name: "prefers-reduced-transparency", value: transparency },
        { name: "prefers-reduced-motion", value: "reduce" },
        { name: "prefers-contrast", value: "no-preference" },
      ] });
      await page.goto("/destinos");
      await ready(page);
      const violations = await new AxeBuilder({ page }).include("#destinos").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(violations.violations).toEqual([]);
      await expect(page.locator("#brasil").getByText("Consultar por WhatsApp", { exact: true })).toBeVisible();
      await page.screenshot({ path: testInfo.outputPath(`catalogo-${transparency}-${width}.png`), fullPage: true, animations: "disabled" });
    });
  }
}

test("metadatos sociales propios de cada ruta respetan el modo SEO configurado", async ({ page }) => {
  const titles: string[] = [];
  const descriptions: string[] = [];
  for (const route of routes) {
    await page.goto(route);
    const title = await page.title();
    titles.push(title);
    descriptions.push((await page.locator('meta[name="description"]').getAttribute("content"))!);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", indexingEnabled ? "index, follow" : "noindex, nofollow");
    const og = await page.locator('meta[property="og:description"]').getAttribute("content");
    expect(og).toBeTruthy();
    if (route !== "/") expect(og).toBe(descriptions.at(-1));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", publicUrl(route));
  }
  expect(new Set(titles).size).toBe(4);
  expect(new Set(descriptions).size).toBe(4);
});

test("el menú móvil sin JavaScript ofrece acceso real a las cuatro rutas", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Menú ＋" })).toBeHidden();
    const link = page.locator("header").getByRole("link", { name: "Menú", exact: true });
    await expect(link).toBeVisible();
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#navegacion$/);
    await expect(page.locator("#navegacion")).toBeFocused();
    await page.locator("footer").getByRole("link", { name: "Nosotros", exact: true }).click();
    await expect(page).toHaveURL(/\/nosotros$/);
    await expect(page.locator("#historia")).toBeVisible();
  } finally { await context.close(); }
});

test("consulta inválida y borrador mantienen etiquetas, foco, asociación y axe", async ({ page }, testInfo) => {
  await page.goto("/contacto#consulta");
  const form = page.getByRole("form", { name: "Consulta de viaje" });
  const message = form.getByLabel("Tu nombre", { exact: true });
  await form.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(message).toBeFocused();
  await expect(message).toHaveAttribute("aria-invalid", "true");
  await expect(message).toHaveAttribute("aria-describedby", "inquiry-error");
  const invalid = await new AxeBuilder({ page }).include("#consulta").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  await message.fill("Prueba QA");
  await form.getByLabel("Contanos qué tenés en mente", { exact: true }).fill("Consulta de prueba QA");
  await form.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(form.getByRole("status")).toBeFocused();
  const draft = await new AxeBuilder({ page }).include("#consulta").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  await testInfo.attach("axe-estados", { body: JSON.stringify({ invalid: invalid.violations, draft: draft.violations }), contentType: "application/json" });
  expect(invalid.violations).toEqual([]);
  expect(draft.violations).toEqual([]);
});

test("reflow a 200%, foco visible y navegación de enlaces internos", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  for (const route of routes) {
    await page.goto(route);
    await ready(page);
    await page.locator("body").evaluate(element => { element.style.zoom = "2"; });
    const overflow = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, elements: [...document.querySelectorAll("body *")].map(element => ({ tag: element.tagName, class: element.className, right: element.getBoundingClientRect().right, text: element.textContent?.slice(0, 45) })).filter(element => element.right > innerWidth + 1) }));
    expect(overflow.scroll <= overflow.width, JSON.stringify({ route, ...overflow })).toBe(true);
    await page.locator("body").evaluate(element => { element.style.zoom = ""; });
    const link = page.locator("footer a").first();
    await link.focus();
    await expect(link).toBeFocused();
    expect(await link.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
  }
});
