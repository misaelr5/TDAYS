import { test, expect, routes, ready } from "./fixtures";

test("menú móvil: teclado, Escape, ciclo de foco, scroll y navegación", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menú ＋" });
  const dialog = page.getByRole("dialog", { name: "Navegación Travel Days" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(await page.locator("body").evaluate(element => element.style.overflow)).toBe("hidden");
  const first = dialog.getByRole("button", { name: "Cerrar menú" });
  const last = dialog.getByRole("link", { name: "Consultanos por WhatsApp" });
  await first.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(toggle).toBeFocused();
  expect(await page.locator("body").evaluate(element => element.style.overflow)).toBe("");
  await toggle.click();
  await dialog.getByRole("link", { name: "Nosotros", exact: true }).click();
  await expect(page).toHaveURL(/\/nosotros$/);
  await expect(dialog).not.toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(await page.locator("body").evaluate(element => element.style.overflow)).toBe("");
});

test("carrusel de destinos: controles, teclado, extremos y navegación al catálogo", async ({ page }) => {
  await page.goto("/");
  const carousel = page.locator("[data-destination-carousel]");
  const viewport = carousel.locator("[data-carousel-viewport]");
  const cards = carousel.locator("[data-destination-preview]");
  const previous = carousel.getByRole("button", { name: "Destinos anteriores", exact: true });
  const next = carousel.getByRole("button", { name: "Destinos siguientes", exact: true });
  await expect(cards).toHaveCount(8);
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
  await next.click();
  await expect.poll(() => viewport.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await expect(previous).toBeEnabled();
  await viewport.focus();
  const scrollBefore = await page.evaluate(() => scrollY);
  await page.keyboard.press("End");
  await expect(next).toBeDisabled();
  await expect.poll(() => viewport.evaluate(element => element.scrollWidth - element.clientWidth - element.scrollLeft)).toBeLessThan(3);
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
  await page.keyboard.press("Home");
  await expect(previous).toBeDisabled();
  await page.keyboard.press("ArrowRight");
  await expect(previous).toBeEnabled();
  await cards.last().focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/destinos#valeria-del-mar$/);
  await expect(page.locator("#valeria-del-mar")).toBeInViewport();
  expect((await page.locator("#valeria-del-mar").boundingBox())!.y).toBeGreaterThanOrEqual(65);
});

test("enlace de salto y navegación compartida", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contenido$/);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link")).toHaveCount(4);
});

test("línea visual compartida y carrusel utilizable con movimiento reducido", async ({ page }) => {
  let font = "";
  for (const route of routes) {
    await page.goto(route);
    await ready(page);
    const current = await page.locator("body").evaluate(element => getComputedStyle(element).fontFamily);
    if (!font) font = current;
    expect(current).toBe(font);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--brand-blue").trim())).toBe("#006cf9");
    await expect(page.locator(".passport, .receipt, .ghost-script")).toHaveCount(0);
  }
  await page.goto("/");
  const carousel = page.locator("[data-destination-carousel]");
  const viewport = carousel.locator("[data-carousel-viewport]");
  expect(await viewport.evaluate(element => getComputedStyle(element).scrollBehavior)).toBe("auto");
  await carousel.getByRole("button", { name: "Destinos siguientes" }).click();
  await expect.poll(() => viewport.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await carousel.getByRole("button", { name: "Destinos anteriores" }).click();
  await expect.poll(() => viewport.evaluate(element => element.scrollLeft)).toBeLessThan(3);
});

test("cuatro rutas, navegación y contacto disponibles sin JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 900 } });
  try {
    const page = await context.newPage();
    for (const route of routes) {
      expect((await page.goto(route))?.status()).toBe(200);
      await ready(page);
      for (const href of routes) {
        await expect(page.locator(`footer a[href="${href}"]`).first()).toBeVisible();
      }
      if (route === "/" || route === "/destinos") {
        const links = page.locator(route === "/" ? "[data-destination-preview]" : "[data-destination-consultation]");
        await expect(links).toHaveCount(8);
        for (const link of await links.all()) await expect(link).toBeVisible();
      }
      if (route === "/") {
        await page.locator("[data-destination-preview]").first().click();
        await expect(page).toHaveURL(/\/destinos#brasil$/);
        await expect(page.locator("#brasil")).toBeInViewport();
      }
    }
    await expect(page.locator("form:visible")).toHaveCount(0);
    await expect(page.locator('main noscript a[href^="https://wa.me/"]')).toHaveCount(1);
    await expect(page.getByRole("link", { name: "escribinos por WhatsApp", exact: true })).toBeVisible();
    await page.getByRole("navigation", { name: "Elegí cómo podemos ayudarte" }).getByRole("link", { name: "Mi experiencia" }).click();
    await expect(page.locator("#experiencia")).toBeVisible();
    await expect(page.locator("#consulta")).toBeHidden();
    await expect(page.getByRole("link", { name: "Dejar una reseña en Google", exact: true })).toHaveAttribute("href", "https://share.google/1j7Yivr2gGxjZ16Xe");
    for (const link of await page.locator("main noscript a").all()) {
      await expect(link).toHaveAttribute("href", /^https:\/\/wa\.me\/5493544312904\?text=/);
    }
  } finally {
    await context.close();
  }
});

test("galería de destinos: orden, categorías, expansión estable en escritorio y swipe en móvil", async ({ page }) => {
  const expected = [["Brasil", "Internacional"], ["Caribe", "Internacional"], ["Carnavales de Jujuy", "Nacional"], ["Cataratas del Iguazú", "Nacional"], ["Los Túneles", "Nacional"], ["Festival de Jesús María", "Nacional"], ["Bayahíbe", "Internacional"], ["Valeria del Mar", "Nacional"]];
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const carousel = page.locator("[data-destination-carousel]");
  const slides = carousel.locator("li");
  await expect(slides).toHaveCount(8);
  for (const [index, [name, category]] of expected.entries()) {
    await expect(slides.nth(index).locator("h3")).toHaveText(name);
    await expect(slides.nth(index).locator("p span").first()).toHaveText(category);
  }
  await carousel.scrollIntoViewIfNeeded();
  const viewport = carousel.locator("[data-carousel-viewport]");
  const widths = () => slides.evaluateAll(items => items.map(item => Math.round(item.getBoundingClientRect().width)));
  const heights = () => slides.evaluateAll(items => items.map(item => Math.round(item.getBoundingClientRect().height)));
  const idle = await widths();
  expect(idle[0]).toBeGreaterThan(idle[1] * 3);
  expect(new Set(await heights()).size).toBe(1);
  await slides.nth(6).hover();
  await expect.poll(async () => (await widths())[6]).toBe(idle[0]);
  expect(new Set(await heights()).size).toBe(1);
  expect(await viewport.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThan(2);
  await expect(carousel.getByRole("button", { name: "Destinos siguientes" })).toBeHidden();
  await slides.nth(7).locator("a").focus();
  await expect(slides.nth(7)).toHaveAttribute("data-active", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(slides.nth(6).locator("a")).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(async () => new Set(await widths()).size).toBe(1);
  const card = (await slides.first().boundingBox())!;
  expect(card.width).toBeLessThan(390 - 24);
  expect(card.height).toBeGreaterThan(400);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
