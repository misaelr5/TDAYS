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

test("carrusel: controles, teclado y ambos extremos", async ({ page }) => {
  await page.goto("/");
  const rail = page.getByRole("region", { name: "Destinos, desplazá para explorar" });
  const previous = page.getByRole("button", { name: "Destinos anteriores" });
  const next = page.getByRole("button", { name: "Destinos siguientes" });
  await expect(previous).toBeDisabled();
  await next.click();
  await expect.poll(() => rail.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await expect(previous).toBeEnabled();
  await rail.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(previous).toBeDisabled();
  for (let i = 0; i < 10 && await next.isEnabled(); i++) {
    await rail.focus();
    await page.keyboard.press("ArrowRight");
    // Scroll events update the end-state on the next rendering frame.
    await expect.poll(() => rail.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  }
  await expect(next).toBeDisabled();
  await previous.click();
  await expect(next).toBeEnabled();
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

test("reduced-motion desactiva parallax y movimiento normal sigue disponible", async ({ page }) => {
  await page.goto("/");
  await ready(page);
  const passport = page.locator(".hero-passport");
  expect(await passport.evaluate(element => getComputedStyle(element).transform)).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await ready(page);
  await expect.poll(() => passport.evaluate(element => getComputedStyle(element).transform)).not.toBe("none");
  const before = await passport.evaluate(element => getComputedStyle(element).transform);
  await page.mouse.wheel(0, 450);
  await expect.poll(() => passport.evaluate(element => getComputedStyle(element).transform)).not.toBe(before);
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
      if (route === "/" || route === "/destinos") await expect(page.locator(".destination-card")).toHaveCount(8);
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
