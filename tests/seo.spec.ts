import { indexingEnabled, publicOrigin, publicPaths, publicUrl } from "../src/config/seo";
import { site } from "../src/config/site";
import { test, expect } from "./fixtures";
import { spawnSync } from "node:child_process";

test("el interruptor exige aprobación literal y entorno producción; previews fallan cerradas", () => {
  for (const [value, siteEnv, vercelEnv, vercel] of [
    [undefined, undefined, undefined, undefined], ["false", "production"],
    ["TRUE", "production"], ["1", "production"], ["true", undefined],
    ["true", "review"], ["true", "production"],
    ["true", "production", "preview", "1"], ["true", "production", "development", "1"],
    ["true", "review", "production", "1"], ["true", "production", undefined, "1"],
  ]) {
    const env = { ...process.env };
    for (const [key, setting] of Object.entries({ SITE_INDEXING: value, SITE_ENV: siteEnv, VERCEL_ENV: vercelEnv, VERCEL: vercel })) {
      if (setting === undefined) delete env[key];
      else env[key] = setting;
    }
    const result = spawnSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--input-type=module", "-e", "import { indexingEnabled } from './src/config/seo.ts'; process.stdout.write(String(indexingEnabled));"], { env, encoding: "utf8", windowsHide: true });
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toBe(String(value === "true" && (vercelEnv === "production" || (!vercelEnv && !vercel && siteEnv === "production"))));
  }
});

test(`SEO real: modo ${indexingEnabled ? "indexable" : "revisión"} en las cinco rutas`, async ({ page, request }) => {
  for (const path of publicPaths) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", indexingEnabled ? "index, follow" : "noindex, nofollow");
    expect(response?.headers()["x-robots-tag"]).toBe(indexingEnabled ? undefined : "noindex, nofollow");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", publicUrl(path));
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", publicUrl(path));
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "es_AR");
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Travel Days");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", await page.title());
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", await page.title());
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage).toMatch(/^https:\/\/traveldays\.tur\.ar\/opengraph-image\.jpg/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", `${publicOrigin}/opengraph-image.jpg`);
    const localImage = await request.get(new URL(ogImage!).pathname + new URL(ogImage!).search);
    expect(localImage.status()).toBe(200);
    expect(localImage.headers()["content-type"]).toContain("image/jpeg");
    const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(schema).toHaveLength(1);
    const organization = JSON.parse(schema[0]);
    expect(organization).toEqual({ "@context": "https://schema.org", "@type": "TravelAgency", "@id": `${publicOrigin}/#organization`, name: site.name, url: publicOrigin, telephone: site.phone, email: site.email, address: site.postalAddress, openingHours: site.openingHours, sameAs: [site.instagram, site.facebook] });
    expect(organization).not.toHaveProperty("aggregateRating");
    expect(organization).not.toHaveProperty("offers");
  }
});

test("sitemap contiene únicamente URLs canónicas confirmadas, sin fechas inventadas", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["x-robots-tag"]).toBe(indexingEnabled ? undefined : "noindex, nofollow");
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  expect(urls).toEqual(publicPaths.map(publicUrl));
  expect(xml).not.toContain("lastmod");
  expect(xml).not.toContain("quienes-somos");
});

test("robots obedece el mismo interruptor y la ruta retirada permanece 404", async ({ request, page }) => {
  const robots = await request.get("/robots.txt");
  const text = await robots.text();
  if (indexingEnabled) {
    expect(text).toContain("Allow: /");
    expect(text).not.toContain("Disallow: /");
    expect(text).toContain(`Sitemap: ${publicOrigin}/sitemap.xml`);
  } else {
    expect(text).toContain("Disallow: /");
    expect(text).not.toContain("Allow: /");
    expect(text).not.toContain("Sitemap:");
  }
  const retired = await page.goto("/quienes-somos");
  expect(retired?.status()).toBe(404);
  expect(await page.locator('meta[name="robots"]').evaluateAll(elements => elements.some(element => element.getAttribute("content")?.includes("noindex")))).toBe(true);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
