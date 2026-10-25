import { prepareMessage, contactLimits } from "../src/features/contact/messages";
import { whatsappUrl } from "../src/config/site";
import { test, expect } from "./fixtures";

test("consulta: obligatorios, espacios, teléfono, Unicode y borrador invalidado al editar", async ({ page }) => {
  await page.goto("/contacto");
  const form = page.getByRole("form", { name: "Consulta de viaje", exact: true });
  const name = form.getByLabel("Tu nombre", { exact: true });
  const message = form.getByLabel("Contanos qué tenés en mente", { exact: true });
  const phone = form.getByLabel("Teléfono de contacto", { exact: false });
  const submit = form.getByRole("button", { name: "Preparar mi consulta" });
  const link = form.getByRole("link", { name: "Revisar y enviar en WhatsApp" });
  await submit.click();
  await expect(name).toBeFocused();
  await expect(link).toHaveCount(0);
  await name.fill("   ");
  await message.fill("Consulta de prueba.");
  await submit.click();
  await expect(form.getByRole("alert")).toContainText("Escribí tu nombre");
  await name.fill(" Lucía & Sol ");
  await phone.fill("abc");
  await submit.click();
  await expect(form.getByRole("alert")).toContainText("Revisá el teléfono");
  await phone.fill("+54 3544 000000");
  await form.getByLabel("¿Adónde te gustaría ir?", { exact: false }).fill("Brasil");
  const literal = "Córdoba & playa 😊\n<script>window.__qaExecuted=true</script>";
  await message.fill(literal);
  await submit.click();
  await expect(form.getByRole("status")).toBeFocused();
  const url = new URL((await link.getAttribute("href"))!);
  expect(url.origin + url.pathname).toBe("https://wa.me/5493544312904");
  expect(url.searchParams.get("text")).toContain("Nombre: Lucía & Sol");
  expect(url.searchParams.get("text")).toContain(literal);
  await form.getByText("Revisar mi mensaje", { exact: true }).click();
  await expect(form.getByRole("status")).toContainText(literal);
  expect(await page.evaluate(() => "__qaExecuted" in window)).toBe(false);
  await message.fill("Otra consulta");
  await expect(link).toHaveCount(0);
  await expect(form.getByRole("status")).toHaveCount(0);
});

test("errores nativos y de aplicación quedan asociados al campo y reciben foco", async ({ page }) => {
  await page.goto("/contacto");
  const form = page.getByRole("form", { name: "Consulta de viaje", exact: true });
  const name = form.getByLabel("Tu nombre", { exact: true });
  await form.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAttribute("aria-describedby", "inquiry-error");
  await expect(form.getByRole("alert")).toHaveAttribute("id", "inquiry-error");
  await name.fill("Prueba QA");
  const message = form.getByLabel("Contanos qué tenés en mente", { exact: true });
  await message.fill("Consulta de prueba");
  const phone = form.getByLabel("Teléfono de contacto", { exact: false });
  await phone.fill("abc");
  await form.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(phone).toBeFocused();
  await expect(phone).toHaveAttribute("aria-invalid", "true");
  await expect(phone).toHaveAttribute("aria-describedby", "inquiry-phone-help inquiry-error");
  await message.fill("Otra consulta de prueba");
  await expect(phone).toHaveAttribute("aria-invalid", "true");
  await phone.fill("+54 3544 000000");
  await expect(phone).not.toHaveAttribute("aria-invalid", "true");
  await expect(form.getByRole("alert")).toHaveCount(0);
});

test("texto invisible se rechaza y WhatsApp conserva Unicode sin romperse con sustitutos aislados", () => {
  const form = new FormData();
  form.set("name", "QA");
  form.set("message", " \u200b\u200d ");
  expect(prepareMessage(form, "inquiry")).toMatchObject({ ok: false, field: "message" });
  const literal = "Lucía & Sol #viaje 50% 😊\nConsulta = fechas + precio";
  expect(new URL(whatsappUrl(literal)).searchParams.get("text")).toBe(literal);
  expect(() => whatsappUrl("QA \uD800")).not.toThrow();
  expect(new URL(whatsappUrl("QA \uD800")).searchParams.get("text")).toBe("QA �");
});

test("opinión escrita obligatoria; nombre, viaje y puntuación opcionales", async ({ page }) => {
  await page.goto("/contacto");
  const form = page.getByRole("form", { name: "Compartir experiencia de viaje", exact: true });
  const message = form.getByLabel("Contanos tu experiencia", { exact: true });
  const submit = form.getByRole("button", { name: "Preparar mi opinión" });
  const link = form.getByRole("link", { name: "Revisar y enviar en WhatsApp" });
  await submit.click();
  await expect(message).toBeFocused();
  await expect(link).toHaveCount(0);
  await message.fill("   ");
  await submit.click();
  await expect(form.getByRole("alert")).toContainText("Escribí cómo fue tu experiencia");
  await message.fill(" Opinión de prueba: gracias 😊 & hasta pronto. ");
  await submit.click();
  expect(new URL((await link.getAttribute("href"))!).searchParams.get("text")).toContain("Puntuación: sin puntuar");
  await form.getByLabel("Tu nombre", { exact: false }).fill("Prueba QA");
  await expect(link).toHaveCount(0);
  await form.getByLabel("¿Qué viaje hiciste?", { exact: false }).fill("Brasil");
  await form.getByLabel("¿Cómo lo valorarías?", { exact: false }).selectOption("5");
  await submit.click();
  const url = new URL((await link.getAttribute("href"))!);
  expect(url.pathname).toBe("/5493544312904");
  expect(url.searchParams.get("text")).toContain("Puntuación: 5/5");
  expect(url.searchParams.get("text")).toContain("Viaje realizado: Brasil");
  await expect(form.getByRole("status")).toBeFocused();
  await expect(form.getByRole("status")).toContainText("Mensaje preparado. Falta enviarlo.");
  await expect(form.getByRole("status")).not.toContainText(/mensaje enviado|opinión publicada|recibimos tu/i);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect(await page.context().cookies()).toEqual([]);
  await page.reload();
  await expect(message).toBeEmpty();
  await expect(link).toHaveCount(0);
});

test("límites y puntuaciones manipuladas se rechazan también fuera de la validación HTML", () => {
  function data(values: Record<string, string>) {
    const form = new FormData();
    for (const [key, value] of Object.entries(values)) form.set(key, value);
    return form;
  }
  for (const field of ["name", "phone", "destination", "message"] as const) {
    const result = prepareMessage(data({ name: "QA", message: "Consulta", [field]: "x".repeat(contactLimits[field] + 1) }), "inquiry");
    expect(result).toMatchObject({ ok: false, field });
  }
  for (const phone of ["123", "1234567890123456", "1234567abc"]) {
    expect(prepareMessage(data({ name: "QA", message: "Consulta", phone }), "inquiry")).toMatchObject({ ok: false, field: "phone" });
  }
  for (const rating of ["0", "6", "5.0", "<script>"]) {
    expect(prepareMessage(data({ message: "Opinión", rating }), "experience")).toMatchObject({ ok: false, field: "rating" });
  }
});
