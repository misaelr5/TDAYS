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
    await expect(page.locator("noscript").getByRole("link", { name: "escribinos por WhatsApp" })).toHaveCount(2);
    for (const link of await page.locator("main noscript a").all()) {
      await expect(link).toHaveAttribute("href", /^https:\/\/wa\.me\/5493544312904\?text=/);
    }
  } finally {
    await context.close();
  }
});
