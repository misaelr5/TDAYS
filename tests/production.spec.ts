import { test, expect } from "./fixtures";
import { prepareMessage } from "../src/features/contact/messages";

test("la trayectoria de 23 años se atribuye a Javier y la agencia conserva 2018", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByText("Experiencia en turismo", { exact: true })).toBeVisible();
  await page.goto("/nosotros", { waitUntil: "networkidle" });
  await expect(page.getByText("Fundación de Travel Days", { exact: true })).toBeVisible();
  await expect(page.locator("dt").filter({ hasText: "Fundación de Travel Days" }).locator("..").locator("dd")).toHaveText("2018");
});

for (const width of [1366, 1920]) {
  test(`rutas principales sin desborde en escritorio ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1080 });
    for (const route of ["/", "/destinos", "/nosotros", "/contacto", "/terminos"]) {
      expect((await page.goto(route, { waitUntil: "networkidle" }))?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}

test("las ocho consultas emiten solo el slug del destino, sin el mensaje", async ({ page }) => {
  await page.addInitScript(() => {
    const events: unknown[] = [];
    Object.assign(window, { __measurement: events });
    window.addEventListener("traveldays:measurement", event => events.push((event as CustomEvent).detail));
    window.addEventListener("click", event => {
      if ((event.target as Element).closest('a[href^="https://wa.me/"]')) event.preventDefault();
    });
  });
  await page.goto("/destinos");
  const links = page.locator("[data-destination-consultation]");
  await expect(links).toHaveCount(8);
  for (const link of await links.all()) await link.click();
  const events = await page.evaluate(() => (window as unknown as { __measurement: { event: string; page: string; destination?: string }[] }).__measurement);
  expect(events.filter(event => event.event === "contact_whatsapp_click")).toHaveLength(8);
  const destinationEvents = events.filter(event => event.event === "destination_inquiry_click");
  expect(destinationEvents).toHaveLength(8);
  expect(new Set(destinationEvents.map(event => event.destination)).size).toBe(8);
  for (const event of destinationEvents) expect(Object.keys(event).sort()).toEqual(["destination", "event", "page"]);
});

test("campos opcionales validan cantidades y meses fuera del HTML", () => {
  const data = new FormData();
  data.set("name", "QA"); data.set("message", "Consulta");
  for (const passengers of ["0", "-1", "2.5", "1e2", "1000"]) {
    data.set("passengers", passengers);
    expect(prepareMessage(data, "inquiry")).toMatchObject({ ok: false, field: "passengers" });
  }
  data.set("passengers", "12");
  for (const month of ["2026-13", "2026-00", "no", "2026-1"]) {
    data.set("month", month);
    expect(prepareMessage(data, "inquiry")).toMatchObject({ ok: false, field: "month" });
  }
  data.set("month", "2027-01"); data.set("origin", "Villa Dolores");
  expect(prepareMessage(data, "inquiry")).toMatchObject({ ok: true, message: expect.stringContaining("Mes y año aproximados: 01/2027") });
});

test("teléfono, correo y redes emiten intención sin transmitir destinos externos", async ({ page }) => {
  await page.addInitScript(() => {
    const events: unknown[] = [];
    Object.assign(window, { __measurement: events });
    window.addEventListener("traveldays:measurement", event => events.push((event as CustomEvent).detail));
    window.addEventListener("click", event => {
      if ((event.target as Element).closest("a[href]")) event.preventDefault();
    });
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/contacto#oficina");
  await page.locator('#oficina a[href^="tel:"]').first().click();
  await page.locator('footer a[href^="mailto:"]').first().click();
  await page.locator('footer').getByRole("link", { name: "Instagram", exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { __measurement: unknown[] }).__measurement)).toEqual([
    { event: "phone_click", page: "/contacto" },
    { event: "email_click", page: "/contacto" },
    { event: "social_click", page: "/contacto" },
  ]);
});

test("consulta completa conserva datos en el borrador y eventos excluyen información personal", async ({ page }) => {
  await page.addInitScript(() => {
    const events: unknown[] = [];
    Object.assign(window, { __measurement: events });
    window.addEventListener("traveldays:measurement", event => events.push((event as CustomEvent).detail));
    // Never navigate to WhatsApp or send a real message during QA.
    window.addEventListener("click", event => {
      if ((event.target as Element).closest('a[href^="https://wa.me/"]')) event.preventDefault();
    });
  });
  await page.goto("/contacto?nombre=privado#consulta");
  const form = page.getByRole("form", { name: "Consulta de viaje", exact: true });
  // fill() can finish on an inert SSR input without entering text in WebKit.
  // Wait for the local handler before supplying any personal data.
  await expect(form).not.toHaveAttribute("inert", "");
  await expect(form.getByRole("button", { name: "Preparar mi consulta" })).toBeEnabled();
  await form.getByLabel("Tu nombre", { exact: true }).fill("Persona QA Privada");
  await expect(form.getByLabel("Tu nombre", { exact: true })).toHaveValue("Persona QA Privada");
  await form.getByLabel("Contanos qué tenés en mente", { exact: true }).fill("Consulta confidencial");
  await form.locator("summary").click();
  await form.locator('[name="destination"]').fill("Bayahíbe");
  await form.locator('[name="phone"]').fill("3544000000");
  await form.locator('[name="month"]').fill("2027-01");
  await form.locator('[name="passengers"]').fill("12");
  await form.locator('[name="origin"]').fill("Villa Dolores");
  await form.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(form.getByRole("status")).toContainText("Mensaje preparado. Falta enviarlo.");
  const link = form.getByRole("link", { name: "Revisar y enviar en WhatsApp" });
  const text = new URL((await link.getAttribute("href"))!).searchParams.get("text")!;
  for (const value of ["Persona QA Privada", "Consulta confidencial", "Bayahíbe", "3544000000", "01/2027", "12", "Villa Dolores"]) expect(text).toContain(value);
  await link.click();
  expect(await page.evaluate(() => (window as unknown as { __measurement: unknown[] }).__measurement)).toEqual([
    { event: "contact_form_start", page: "/contacto" },
    { event: "contact_whatsapp_click", page: "/contacto" },
    { event: "contact_form_whatsapp_open", page: "/contacto" },
  ]);
  await form.locator('[name="origin"]').fill("Otra localidad");
  await expect(link).toHaveCount(0);
});

test("CSP y headers se sirven en producción sin bloquear la hidratación", async ({ page, request }) => {
  for (const path of ["/", "/destinos", "/nosotros", "/contacto", "/terminos", "/no-existe-qa"]) {
    const response = await request.get(path);
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toContain("object-src 'none'");
    expect(headers["content-security-policy"]).not.toContain("unsafe-eval");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-powered-by"]).toBeUndefined();
  }
  await page.addInitScript(() => {
    const violations: string[] = [];
    Object.assign(window, { __cspViolations: violations });
    document.addEventListener("securitypolicyviolation", event => violations.push(event.violatedDirective));
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Menú ＋" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __cspViolations: string[] }).__cspViolations)).toEqual([]);
});
