import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { publicOrigin, publicPaths, publicUrl } from "../src/config/seo.ts";

// Inspect the artifact, not the current process flags: a review build must fail.
const dist = process.env.RECREAR_QA === "1" ? ".next-qa" : ".next";
const read = path => readFileSync(resolve(dist, path), "utf8");
for (const path of publicPaths) {
  const html = read(`server/app/${path === "/" ? "index" : path.slice(1)}.html`);
  assert.match(html, /<meta name="robots" content="index, follow"/);
  assert.ok(html.includes(`<link rel="canonical" href="${publicUrl(path)}"`), `Canonical incorrecto: ${path}`);
}
const robots = read("server/app/robots.txt.body");
assert.match(robots, /Allow: \//);
assert.doesNotMatch(robots, /Disallow: \//);
assert.ok(robots.includes(`Sitemap: ${publicOrigin}/sitemap.xml`));
const sitemap = read("server/app/sitemap.xml.body");
assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]), publicPaths.map(publicUrl));
const routes = JSON.parse(read("routes-manifest.json"));
assert.ok(!routes.headers.some(route => route.headers.some(header => header.key.toLowerCase() === "x-robots-tag" && /noindex/i.test(header.value))), "El build todavía bloquea indexación por HTTP");
console.log(`SEO de producción: ${publicPaths.length} páginas indexables, canonical, robots, sitemap y headers verificados.`);
