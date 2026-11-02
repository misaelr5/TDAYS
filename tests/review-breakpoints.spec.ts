import { test, expect } from "./fixtures";

// This matrix verifies the requested widths without changing approved pixel baselines.
const reviewWidths = [360, 390, 430, 768, 1440] as const;
const publicPages = ["/", "/destinos", "/nosotros", "/contacto", "/terminos"] as const;
const confirmedDestinations = [
  ["brasil", "Brasil"],
  ["caribe", "Caribe"],
  ["carnavales-de-jujuy", "Carnavales de Jujuy"],
  ["cataratas-del-iguazu", "Cataratas del Iguazú"],
  ["los-tuneles", "Los Túneles"],
  ["festival-de-jesus-maria", "Festival de Jesús María"],
  ["bayahibe", "Bayahíbe"],
  ["valeria-del-mar", "Valeria del Mar"],
] as const;

for (const width of reviewWidths) {
  test(`revisión de entrega: cinco páginas y 404 sin desborde a ${width}px`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    for (const path of [...publicPages, "/revision-ruta-inexistente"]) {
      // Drain prefetches before the next full navigation, including in WebKit.
      const response = await page.goto(path, { waitUntil: "networkidle" });
      expect(response?.status(), path).toBe(path === "/revision-ruta-inexistente" ? 404 : 200);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe("loaded");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
      if (response?.status() === 404) {
        await expect(page.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
      }
    }
  });
}

test("revisión a 430px: los ocho enlaces profundos abren su ficha y consulta específica", async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 430, height: 900 });
  const response = await page.goto("/destinos#brasil", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(200);
  for (const [slug, name] of confirmedDestinations) {
    // Fragment changes stay in the same document and have no HTTP response.
    await page.goto(`/destinos#${slug}`, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(new RegExp(`/destinos#${slug}$`));
    const card = page.locator(`[data-destination-consultation][id="${slug}"]`);
    await expect(card).toHaveAccessibleName(`Consultar por ${name} en WhatsApp`);
    await expect(card.locator("..")).toHaveAttribute("data-current", "true");
    await expect(card).toBeInViewport();
    await expect(card.getByRole("heading", { name, exact: true })).toBeVisible();
    const href = await card.getAttribute("href");
    expect(href).not.toBeNull();
    const target = new URL(href!);
    expect(target.origin + target.pathname).toBe("https://wa.me/5493544312904");
    expect(target.searchParams.get("text")).toContain(name);
    await expect(card).toHaveAttribute("target", "_blank");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await expect(page.locator("[data-destination-consultation]")).toHaveCount(8);
});

for (const width of [360, 390, 430]) {
  test(`revisión móvil: foco, Escape y navegación del menú a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const toggle = page.getByRole("button", { name: "Menú ＋" });
    const dialog = page.getByRole("dialog", { name: "Navegación Travel Days" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const close = dialog.getByRole("button", { name: "Cerrar menú" });
    await close.focus();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("link", { name: "Seguinos en Facebook" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await dialog.getByRole("link", { name: "Contacto", exact: true }).click();
    await expect(page).toHaveURL(/\/contacto$/);
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole("form", { name: "Consulta de viaje", exact: true })).toBeVisible();
    expect(await page.locator("body").evaluate(element => element.style.overflow)).toBe("");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("Egresados se alcanza desde el menú móvil de otra página y permite elegir secundaria", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contacto");
  await page.getByRole("button", { name: "Menú ＋" }).click();
  const menu = page.getByRole("dialog", { name: "Navegación Travel Days" });
  await menu.getByRole("link", { name: "Egresados Primaria y secundaria", exact: true }).click();
  await expect(menu).not.toBeVisible();
  await expect(page).toHaveURL(/\/#egresados$/);
  const section = page.locator("#egresados");
  await expect(section.getByRole("heading", { name: "Egresados.", exact: true })).toBeInViewport();
  await expect(section.locator('[data-level="secundaria"]')).toBeVisible();
  await expect(section.getByRole("link", { name: "Consultar por secundaria", exact: true })).toHaveAttribute("href", /egresados%20de%20secundaria/);
  expect(await page.locator("body").evaluate(element => element.style.overflow)).toBe("");
});

test("revisión a 430px: formulario expandido y borrador conservan reflow y datos", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 900 });
  await page.goto("/contacto#consulta", { waitUntil: "networkidle" });
  const form = page.getByRole("form", { name: "Consulta de viaje", exact: true });
  await form.locator("summary").click();
  await form.getByLabel("Tu nombre", { exact: true }).fill("Persona de prueba QA");
  await form.getByLabel("Contanos qué tenés en mente", { exact: true }).fill("Consulta de prueba sin envío.");
  const fields = {
    phone: "3544000000",
    destination: "Bayahíbe",
    month: "2027-01",
    passengers: "12",
    origin: "Villa Dolores",
  };
  for (const [name, value] of Object.entries(fields)) {
    const control = form.locator(`[name="${name}"]`);
    await expect(control).toBeVisible();
    await control.fill(value);
    const box = await control.boundingBox();
    expect(box, name).not.toBeNull();
    expect(box!.x, name).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, name).toBeLessThanOrEqual(430);
  }
  await form.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(form.getByRole("status")).toBeFocused();
  const link = form.getByRole("link", { name: "Revisar y enviar en WhatsApp" });
  const draft = new URL((await link.getAttribute("href"))!).searchParams.get("text");
  for (const value of ["Bayahíbe", "01/2027", "12", "Villa Dolores", "3544000000"]) expect(draft).toContain(value);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // Assert the handoff link only: never open WhatsApp or send a real message.
  await form.locator('[name="origin"]').fill("Otra localidad");
  await expect(link).toHaveCount(0);
});
