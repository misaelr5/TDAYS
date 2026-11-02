import { decodeFragment } from "../src/lib/fragment";
import { test, expect } from "./fixtures";

test("fragmentos externos: percent encoding inválido y Unicode válido", () => {
  for (const value of ["#%", "#%ZZ", "#%E0%A4%A"]) expect(decodeFragment(value)).toBe("");
  expect(decodeFragment("#caf%C3%A9")).toBe("café");
  expect(decodeFragment("#%65quipo")).toBe("equipo");
});

for (const route of ["/nosotros", "/destinos"]) {
  test(`carga, recarga y cambios a hashes inválidos conservan ${route}`, async ({ page }) => {
    for (const hash of ["#%", "#%E0%A4%A", "#no-existe", "#caf%C3%A9"]) {
      // This case checks a completed load/reload, not tearing down in-flight RSC
      // prefetches (WebKit reports those cancellations as access-control errors).
      await page.goto(`${route}${hash}`, { waitUntil: "networkidle" });
      await expect(page.locator("main")).toBeVisible();
      if (route === "/nosotros") await expect(page.locator("#historia")).toBeVisible();
      await page.reload({ waitUntil: "networkidle" });
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });
}

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`capítulos, footer, subelementos e historial con movimiento ${reducedMotion}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion });
    await page.goto("/nosotros#%65quipo");
    const tabs = page.getByRole("tablist", { name: "Conocé la agencia" });
    await expect(page.locator("#equipo")).toBeVisible();
    await page.locator('footer a[href="/nosotros#historia"]').click();
    await expect(page).toHaveURL(/#historia$/);
    await expect(page.locator("#historia")).toBeVisible();
    await expect(tabs.getByRole("tab", { name: "Nuestra historia" })).toHaveAttribute("aria-selected", "true");
    await page.goBack();
    await expect(page.locator("#equipo")).toBeVisible();
    await page.goForward();
    await expect(page.locator("#historia")).toBeVisible();
    await tabs.getByRole("tab", { name: "El equipo", exact: true }).click();
    // Real hash navigation to an existing heading inside the hidden history panel.
    await page.evaluate(() => { location.hash = "backing-heading"; });
    await expect(page.locator("#historia")).toBeVisible();
    await expect(page.locator("#backing-heading")).toBeInViewport();
    await page.reload();
    await expect(page.locator("#backing-heading")).toBeInViewport();
    await tabs.getByRole("tab", { name: "El equipo", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.getByRole("tab", { name: "Cómo te acompañamos" })).toBeFocused();
    await expect(page.locator("#compromiso")).toBeVisible();
    await page.goBack();
    await expect(page.locator("#historia")).toBeVisible();
  });
}

test("Next Link desde otra ruta abre el capítulo indicado", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-trust-card][href="/nosotros#backing-heading"]').click();
  await expect(page.locator("#backing-heading")).toBeInViewport();
  await expect(page.locator("#historia")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test("Ctrl y clic central conservan la apertura nativa de capítulos", async ({ page, context, browserName }) => {
  await page.goto("/nosotros");
  const team = page.getByRole("tab", { name: "El equipo", exact: true });
  for (const options of [{ modifiers: ["Control"] as ("Control")[] }, { button: "middle" as const }]) {
    // The Windows WebKit port activates middle-click anchors in place. Keep
    // testing that native behavior rather than requiring a nonexistent popup.
    if (browserName === "webkit" && "button" in options) {
      await team.click(options);
      await expect(page).toHaveURL(/#equipo$/);
      await expect(page.locator("#equipo")).toBeVisible();
      continue;
    }
    const popup = context.waitForEvent("page");
    await team.click(options);
    const opened = await popup;
    await opened.waitForLoadState();
    await expect(opened).toHaveURL(/#equipo$/);
    await expect(opened.locator("#equipo")).toBeVisible();
    await expect(page.locator("#historia")).toBeVisible();
    await opened.close();
  }
});

test("móvil, reflow 200% y sin JS conservan capítulos accesibles", async ({ page, browser, baseURL }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto("/nosotros#equipo");
  await page.locator("body").evaluate(element => { element.style.zoom = "2"; });
  await page.getByRole("tab", { name: "Cómo te acompañamos", exact: true }).click();
  await expect(page.locator("#compromiso")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 320, height: 900 } });
  try {
    const nojs = await context.newPage();
    await nojs.goto("/nosotros");
    await nojs.getByRole("tab", { name: "El equipo", exact: true }).click();
    await expect(nojs).toHaveURL(/#equipo$/);
    await expect(nojs.locator("#equipo")).toBeVisible();
    expect(await nojs.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { await context.close(); }
});
