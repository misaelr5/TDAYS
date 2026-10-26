import { test as base, expect, type Page } from "@playwright/test";

export const routes = ["/", "/destinos", "/nosotros", "/contacto"] as const;
export const widths = [320, 360, 375, 390, 768, 1024, 1440] as const;

export const test = base.extend<{ networkGuard: void }>({
  networkGuard: [async ({ context, baseURL }, use) => {
    const errors: string[] = [];
    const external: string[] = [];
    const writes: string[] = [];
    const failedAssets: string[] = [];
    await context.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.protocol.startsWith("http") && url.origin !== new URL(baseURL!).origin) {
        external.push(request.url());
        await route.abort();
      } else {
        await route.continue();
      }
    });
    context.on("page", page => page.on("pageerror", error => errors.push(error.message)));
    context.on("request", request => {
      if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) writes.push(request.url());
    });
    context.on("response", response => {
      if (["image", "font", "stylesheet", "script"].includes(response.request().resourceType()) && response.status() >= 400) {
        failedAssets.push(`${response.status()} ${response.url()}`);
      }
    });
    context.on("requestfailed", request => {
      if (["image", "font", "stylesheet", "script"].includes(request.resourceType()) && request.failure()?.errorText !== "net::ERR_ABORTED") {
        failedAssets.push(`${request.failure()?.errorText} ${request.url()}`);
      }
    });
    await use();
    expect(errors, "Errores de ejecución en el navegador").toEqual([]);
    expect(external, "Las pruebas no deben abrir servicios externos").toEqual([]);
    expect(writes, "Los formularios no deben enviar ni persistir datos").toEqual([]);
    expect(failedAssets, "Recursos locales fallidos").toEqual([]);
  }, { auto: true }],
});

export { expect };

export async function ready(page: Page) {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await expect(page.locator("h1")).toHaveCount(1);
  // Trigger real lazy loading before judging images or capturing the whole page.
  for (const image of await page.locator("img").all()) {
    // Closed dialogs can contain eagerly loaded logos; they cannot be scrolled into view.
    if (!(await image.isVisible())) continue;
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => {
      const img = element as HTMLImageElement;
      return img.complete && img.naturalWidth > 0;
    })).toBe(true);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  if (new URL(page.url()).pathname === "/") {
    await expect(page.locator(".site-header")).not.toHaveClass(/header-solid/);
  } else {
    await expect(page.locator(".site-header")).toHaveClass(/header-solid/);
  }
}
