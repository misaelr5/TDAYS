import AxeBuilder from "@axe-core/playwright";
import { test, expect, routes, ready } from "./fixtures";

test("metadatos sociales son propios de cada ruta y se conserva el modo de revisión", async ({ page }) => {
  const titles: string[] = [];
  const descriptions: string[] = [];
  for (const route of routes) {
    await page.goto(route);
    const title = await page.title();
    titles.push(title);
    descriptions.push((await page.locator('meta[name="description"]').getAttribute("content"))!);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    const og = await page.locator('meta[property="og:description"]').getAttribute("content");
    expect(og).toBeTruthy();
    if (route !== "/") expect(og).toBe(descriptions.at(-1));
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
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

test("opinión inválida y borrador mantienen etiquetas, foco, asociación y axe", async ({ page }, testInfo) => {
  await page.goto("/contacto#experiencia");
  const form = page.getByRole("form", { name: "Compartir experiencia de viaje" });
  const message = form.getByLabel("Contanos tu experiencia", { exact: true });
  await form.getByRole("button", { name: "Preparar mi opinión" }).click();
  await expect(message).toBeFocused();
  await expect(message).toHaveAttribute("aria-invalid", "true");
  await expect(message).toHaveAttribute("aria-describedby", "experience-message-help experience-error");
  const invalid = await new AxeBuilder({ page }).include("#experiencia").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  await message.fill("Opinión de prueba QA");
  await form.getByRole("button", { name: "Preparar mi opinión" }).click();
  await expect(form.getByRole("status")).toBeFocused();
  const draft = await new AxeBuilder({ page }).include("#experiencia").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
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
