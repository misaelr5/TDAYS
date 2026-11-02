import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import { whatsappUrl } from "../src/config/site";

// These cases deliberately block application scripts. The normal fixture rejects
// failed assets, so keep equivalent write/external guards local to this scenario.
async function guardNetwork(context: BrowserContext, baseURL: string, scripts: "blocked" | Promise<void> | "allowed") {
  const writes: string[] = [];
  const external: string[] = [];
  let scriptRequests = 0;
  await context.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) {
      writes.push(`${request.method()} ${url.pathname}`);
      await route.abort("aborted");
    } else if (url.protocol.startsWith("http") && url.origin !== new URL(baseURL).origin) {
      external.push(url.origin);
      await route.abort("aborted");
    } else if (request.resourceType() === "script") {
      scriptRequests++;
      if (scripts === "blocked") await route.abort("aborted");
      else {
        if (scripts !== "allowed") await scripts;
        await route.continue();
      }
    } else await route.continue();
  });
  return { writes, external, scriptRequests: () => scriptRequests };
}

async function expectSafeFallback(page: Page) {
  const form = page.locator("form[data-inquiry-form]");
  const fallback = page.locator('[data-contact-fallback="inquiry"]');
  await expect(form).toHaveAttribute("inert", "");
  await expect(form.locator('button[type="submit"]')).toBeDisabled();
  await expect(fallback).toBeVisible();
  const link = fallback.getByRole("link", { name: "escribinos por WhatsApp" });
  await expect(link).toHaveAttribute("href", whatsappUrl("Hola Travel Days, quiero organizar un viaje."));
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  await link.focus();
  await expect(link).toBeFocused();
  // Do not activate the external fallback when testing Enter on the inert area.
  await link.evaluate(element => element.blur());
  return form;
}

async function tryNativeSubmission(page: Page) {
  const form = await expectSafeFallback(page);
  // Supply valid values without bypassing inert for user interaction. Otherwise
  // required-field validation alone could conceal a native-submit regression.
  await form.locator('[name="name"]').evaluate(element => { (element as HTMLInputElement).value = "Persona QA"; });
  await form.locator('[name="message"]').evaluate(element => { (element as HTMLTextAreaElement).value = "Consulta privada QA"; });
  const name = form.locator('[name="name"]');
  await name.scrollIntoViewIfNeeded();
  const fieldBox = await name.boundingBox();
  expect(fieldBox).not.toBeNull();
  await page.mouse.click(fieldBox!.x + fieldBox!.width / 2, fieldBox!.y + fieldBox!.height / 2);
  await name.evaluate(element => (element as HTMLInputElement).focus());
  await expect(name).not.toBeFocused();
  await page.keyboard.press("Enter");
  const submit = form.locator('button[type="submit"]');
  await submit.scrollIntoViewIfNeeded();
  const buttonBox = await submit.boundingBox();
  expect(buttonBox).not.toBeNull();
  await page.mouse.click(buttonBox!.x + buttonBox!.width / 2, buttonBox!.y + buttonBox!.height / 2);
  await page.keyboard.press("Enter");
  await expect(form.locator("[data-inquiry-draft]")).toHaveCount(0);
  expect(new URL(page.url()).pathname).toBe("/contacto");
}

test("consulta con JavaScript habilitado y bundles bloqueados no transmite datos", async ({ page, context, baseURL }) => {
  const network = await guardNetwork(context, baseURL!, "blocked");
  await page.goto("/contacto", { waitUntil: "domcontentloaded" });
  await tryNativeSubmission(page);
  expect(network.scriptRequests()).toBeGreaterThan(0);
  expect(network.writes).toEqual([]);
  expect(network.external).toEqual([]);
});

test("consulta espera los bundles, conserva WhatsApp y luego prepara el borrador local", async ({ page, context, baseURL }) => {
  let releaseScripts = () => {};
  const scripts = new Promise<void>(resolve => { releaseScripts = resolve; });
  const network = await guardNetwork(context, baseURL!, scripts);
  try {
    await page.goto("/contacto", { waitUntil: "commit" });
    await tryNativeSubmission(page);
    expect(network.writes).toEqual([]);
    releaseScripts();
    const form = page.locator("form[data-inquiry-form]");
    await expect(form).not.toHaveAttribute("inert", "");
    await expect(form.getByRole("button", { name: "Preparar mi consulta" })).toBeEnabled();
    await expect(page.locator('[data-contact-fallback="inquiry"]')).toHaveCount(0);
    await form.getByLabel("Tu nombre", { exact: true }).fill("Persona QA");
    await form.getByLabel("Contanos qué tenés en mente", { exact: true }).fill("Consulta privada QA");
    await form.getByRole("button", { name: "Preparar mi consulta" }).click();
    await expect(form.getByRole("status")).toContainText("Mensaje preparado. Falta enviarlo.");
    const handoff = form.getByRole("link", { name: "Revisar y enviar en WhatsApp" });
    const href = await handoff.getAttribute("href");
    expect(new URL(href!).searchParams.get("text")).toContain("Consulta: Consulta privada QA");
    await form.getByLabel("Tu nombre", { exact: true }).fill("Otra persona QA");
    await expect(handoff).toHaveCount(0);
    expect(network.scriptRequests()).toBeGreaterThan(0);
    expect(network.writes).toEqual([]);
    expect(network.external).toEqual([]);
  } finally {
    releaseScripts();
  }
});

test.describe("consulta sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("conserva un único fallback accesible sin mostrar un formulario inoperable", async ({ page, context, baseURL }) => {
    const network = await guardNetwork(context, baseURL!, "allowed");
    await page.goto("/contacto", { waitUntil: "domcontentloaded" });
    const form = page.locator("form[data-inquiry-form]");
    await expect(form).toBeHidden();
    const fallback = page.locator('[data-contact-fallback="inquiry"]');
    await expect(fallback).toHaveCount(1);
    await expect(fallback).toBeVisible();
    await expect(fallback.getByRole("link", { name: "escribinos por WhatsApp" }))
      .toHaveAttribute("href", whatsappUrl("Hola Travel Days, quiero organizar un viaje."));
    expect(network.writes).toEqual([]);
    expect(network.external).toEqual([]);
  });
});
