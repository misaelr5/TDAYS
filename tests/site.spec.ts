import AxeBuilder from "@axe-core/playwright";
import { destinations, publishedDestinations } from "../src/features/destinations/data";
import { test, expect, routes, widths, ready } from "./fixtures";

for (const route of routes) {
  for (const width of widths) {
    test(`${route} conserva estructura y recursos a ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      expect((await page.goto(route))?.status()).toBe(200);
      await ready(page);
      await expect(page.locator("main")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect.poll(() => page.evaluate(() => [...document.images].filter(image => !image.complete || image.naturalWidth === 0).length)).toBe(0);
    });
  }
}

test("ocho destinos confirmados, datos comerciales vacíos y consultas específicas", async ({ page }) => {
  expect(destinations).toHaveLength(8);
  expect(publishedDestinations).toHaveLength(8);
  for (const destination of destinations) {
    expect(destination.price).toBeNull();
    expect(destination.dates).toEqual([]);
    expect(destination.services).toEqual([]);
    expect(destination.itinerary).toEqual([]);
  }
  for (const route of ["/", "/destinos"]) {
    await page.goto(route);
    if (route === "/") {
      await expect(page.locator("[data-destination-preview]")).toHaveCount(8);
      await expect(page.locator("[data-destination-consultation]")).toHaveCount(0);
      for (const destination of publishedDestinations) {
        await expect(page.getByRole("link", { name: `Explorar ${destination.name} en el catálogo`, exact: true })).toHaveAttribute("href", `/destinos#${destination.slug}`);
      }
    } else {
      await expect(page.locator("[data-destination-consultation]")).toHaveCount(8);
      for (const destination of publishedDestinations) {
        const card = page.getByRole("link", { name: `Consultar por ${destination.name} en WhatsApp`, exact: true });
        await expect(card).toHaveAttribute("id", destination.slug);
        const url = new URL((await card.getAttribute("href"))!);
        expect(url.origin + url.pathname).toBe("https://wa.me/5493544312904");
        expect(url.searchParams.get("text")).toBe(destination.consultation?.message);
      }
    }
    const links = await page.locator('a[href^="https://wa.me/"]').evaluateAll(elements => elements.map(element => (element as HTMLAnchorElement).href));
    expect(links.length).toBeGreaterThan(0);
    for (const href of links) {
      const url = new URL(href);
      expect(url.pathname).toBe("/5493544312904");
      expect(url.searchParams.get("text")).toBeTruthy();
    }
  }
});

test("metadatos, bloqueo de indexación, headers y rutas retiradas", async ({ page, request }) => {
  for (const route of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(/Travel Days/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Travel Days/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es-AR");
  }
  const response = await request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  for (const route of ["/quienes-somos", "/ruta-inexistente-qa"]) {
    expect((await page.goto(route))?.status()).toBe(404);
    await expect(page.getByRole("link", { name: /Volver al inicio/ })).toHaveAttribute("href", "/");
  }
});

test("404 ocupa la pantalla, oculta la navegación global y ofrece volver al inicio", async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect((await page.goto("/ruta-inexistente-qa"))?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Este destinono está en el mapa.");
    await expect(page.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
    await expect(page.locator(".site-header")).toBeHidden();
    await expect(page.locator(".footer")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator("main").evaluate(element => element.getBoundingClientRect().height >= innerHeight)).toBe(true);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ruta-inexistente-qa");
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(result.violations).toEqual([]);
});

for (const route of routes) {
  for (const width of [390, 1440]) {
    test(`axe ${route} a ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await ready(page);
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      await testInfo.attach("axe", { body: JSON.stringify({ violations: result.violations, incomplete: result.incomplete }, null, 2), contentType: "application/json" });
      expect(result.violations).toEqual([]);
    });
  }
}
