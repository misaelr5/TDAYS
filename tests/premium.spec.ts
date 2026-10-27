import { test, expect } from "./fixtures";

test("los capítulos de Nosotros funcionan como pestañas en el lugar", async ({ page }) => {
  await page.goto("/nosotros");
  const tabs = page.getByRole("tablist", { name: "Conocé la agencia" });
  await expect(tabs.getByRole("tab")).toHaveText(["Nuestra historia", "El equipo", "Cómo te acompañamos", "Visitanos"]);
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await expect(page.getByRole("tabpanel")).toHaveAttribute("id", "historia");
  await tabs.getByRole("tab", { name: "El equipo" }).click();
  await expect(page).toHaveURL(/\/nosotros#equipo$/);
  await expect(tabs.getByRole("tab", { name: "El equipo" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#equipo")).toBeInViewport();
  await expect(page.locator("#historia")).toBeHidden();
  // The bar stays stuck under the header while reading the chapter.
  await page.mouse.wheel(0, 900);
  await expect(tabs).toBeInViewport();
  await tabs.getByRole("tab", { name: "El equipo" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Cómo te acompañamos" })).toBeFocused();
  await expect(page.locator("#compromiso")).toBeVisible();
  await expect(page.locator("#equipo")).toBeHidden();
  await page.goto("/nosotros#visitanos");
  await expect(page.locator("#visitanos")).toBeInViewport();
  await expect(tabs.getByRole("tab", { name: "Visitanos" })).toHaveAttribute("aria-selected", "true");
});
