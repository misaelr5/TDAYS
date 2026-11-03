import { test, expect } from "./fixtures";
import { mediaManifest } from "../src/config/media";

for (const width of [390, 1440]) test(`publicación: rutas, imágenes, navegación y consultas a ${width}px`, async ({ page }) => {
  test.setTimeout(150_000);
  await page.setViewportSize({ width, height: 900 });
  for (const route of ["/", "/destinos", "/nosotros", "/contacto", "/terminos"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    for (const img of await page.locator("main img").all()) {
      if (!await img.isVisible()) continue;
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0), { timeout: 25_000 }).toBe(true);
    }
    for (const link of await page.locator('a[href*="wa.me/"]').all()) {
      const url = new URL((await link.getAttribute("href"))!);
      expect(url.protocol).toBe("https:");
      expect(url.pathname).toBe("/5493544312904");
      expect(url.searchParams.get("text")?.trim().length).toBeGreaterThan(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
  await page.goto("/");
  if (width >= 768) {
    await page.getByRole("navigation", { name: "Navegación principal", exact: true }).getByRole("link", { name: "Nosotros", exact: true }).click();
    await expect(page).toHaveURL(/\/nosotros$/);
  } else {
    await page.getByRole("button", { name: /Menú/ }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Nosotros", exact: true }).click();
    await expect(page).toHaveURL(/\/nosotros$/);
  }
});

test("publicación: todos los derivados aprobados responden y los videos admiten rangos", async ({ request }) => {
  test.setTimeout(150_000);
  const paths = new Set<string>();
  for (const asset of Object.values(mediaManifest)) {
    if (!asset || asset.authorization.status !== "approved") continue;
    for (const variant of [asset.desktop, ...(asset.mobile ? [asset.mobile] : [])]) {
      paths.add(variant.src);
      if ("poster" in variant) paths.add(variant.poster.src);
    }
  }
  // Static Assets omits Content-Length, which stalls HEAD in Playwright's client for
  // seconds: images are fetched whole and videos through a small byte range.
  for (const path of paths) {
    if (path.endsWith(".mp4")) {
      const range = await request.get(path, { headers: { Range: "bytes=0-63" } });
      expect(range.status(), path).toBe(206);
      expect((await range.body()).length, path).toBe(64);
    } else {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  }
});
