import { readFileSync, readdirSync, mkdirSync, mkdtempSync, writeFileSync, symlinkSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import { renderToStaticMarkup } from "react-dom/server";
import { approvedMedia, mediaManifest, type ImageAsset, type MediaManifest, type VideoAsset } from "../src/config/media";
import { mediaFileErrors, resolveMedia, verifyManifest } from "../src/features/media/files";
import { ApprovedMedia, MediaContent } from "../src/features/media/approved-media";
import { AmbientVideo, videoPlaybackPolicy } from "../src/features/media/ambient-video";
import { test, expect } from "./fixtures";

const image: ImageAsset = {
  id: "qa-only", type: "image", alt: "Logo original usado únicamente como fixture",
  provenance: "Nota interna de procedencia QA",
  authorization: { status: "approved", evidence: "Evidencia sintética, no aprobación comercial" },
  desktop: { src: "/media/logos/1.png", focal: { x: 35, y: 60 } },
  mobile: { src: "/media/logos/1.png", focal: { x: 70, y: 40 } },
};

test("autorización: vacío, pendiente, rechazado y evidencia incompleta mantienen fallback", () => {
  expect(Object.keys(mediaManifest).sort()).toEqual(["destination:bayahibe", "destination:brasil", "destination:caribe", "destination:carnavales-de-jujuy", "destination:cataratas-del-iguazu", "destination:festival-de-jesus-maria", "destination:los-tuneles", "destination:valeria-del-mar", "hero", "page:inicio", "page:nosotros", "school:maestros", "school:primaria", "school:primaria-detail", "school:secundaria", "team:azul-barrera", "team:daiana-dascon", "team:dj-mosca", "team:ezequiel-grego", "team:javier-garay", "team:jorge-angelina", "team:karoll-tello"]);
  expect(approvedMedia("hero", {})).toBeNull();
  for (const status of ["pending", "rejected"] as const) {
    expect(resolveMedia("hero", { hero: { ...image, authorization: { status } } })).toBeNull();
  }
  for (const asset of [{ ...image, provenance: " " }, { ...image, authorization: { status: "approved" as const, evidence: " " } }, { ...image, alt: " " }]) {
    expect(approvedMedia("hero", { hero: asset })).toBeNull();
  }
  expect(approvedMedia("hero", { hero: image })).toEqual(image);
  expect(resolveMedia("hero", { hero: image })).not.toBeNull();
});

test("rutas locales, extensiones seguras y focos válidos son obligatorios", () => {
  for (const src of ["https://drive.google.com/photo.jpg", "/media/../private.png", "/media/%2e%2e/private.png", "/media/a.png?secret=1", "/media/a.png#x", "/media//a.png", "/media/a.svg", "/media/Logo.PNG", "/media/a\\b.png"]) {
    const manifest = { hero: { ...image, desktop: { ...image.desktop, src } } } as MediaManifest;
    expect(resolveMedia("hero", manifest), src).toBeNull();
    expect(verifyManifest(manifest).errors.length).toBeGreaterThan(0);
  }
  for (const x of [-1, 101, NaN, Infinity]) {
    expect(approvedMedia("hero", { hero: { ...image, mobile: { ...image.desktop, focal: { x, y: 50 } } } })).toBeNull();
  }
});

test("archivo inexistente bloquea publicación y verificación", () => {
  const missing: ImageAsset = { ...image, desktop: { ...image.desktop, src: "/media/qa-missing.png" } };
  expect(approvedMedia("hero", { hero: missing })).not.toBeNull();
  expect(resolveMedia("hero", { hero: missing })).toBeNull();
  expect(verifyManifest({ hero: missing }).errors).toContain("hero: Falta el archivo /media/qa-missing.png");
});

test("un enlace del filesystem no puede escapar de public/media", () => {
  const root = mkdtempSync(resolve("output/migration/media-fixtures-"));
  mkdirSync(join(root, "media"));
  mkdirSync(join(root, "outside"));
  writeFileSync(join(root, "outside", "test.png"), "fixture sin contenido comercial");
  symlinkSync(join(root, "outside"), join(root, "media", "escape"), "junction");
  const asset: ImageAsset = { ...image, mobile: undefined, desktop: { ...image.desktop, src: "/media/escape/test.png" } };
  expect(mediaFileErrors(asset, root)).toEqual(["Archivo fuera de media: /media/escape/test.png"]);
  expect(resolveMedia("hero", { hero: asset }, root)).toBeNull();
});

test("renderer conserva fallback y omite notas internas al producir variantes y focos", () => {
  expect(renderToStaticMarkup(<ApprovedMedia slot="graduates"><span>Fallback de prueba</span></ApprovedMedia>)).toBe("<span>Fallback de prueba</span>");
  const asset = resolveMedia("hero", { hero: image })!;
  expect(Object.keys(asset).sort()).toEqual(["alt", "desktop", "mobile", "type"]);
  const html = renderToStaticMarkup(<MediaContent asset={asset} />);
  expect(html).toContain('<source media="(max-width: 767px)"');
  expect(html).toContain("35% 60%");
  expect(html).toContain("70% 40%");
  expect(html).toContain("srcSet=");
  expect(html).not.toContain(image.provenance);
  expect(html).not.toContain("Evidencia sintética, no aprobación comercial");
});

test("video exige poster válido y respeta movimiento, red y ahorro de datos", () => {
  const video: VideoAsset = { ...image, type: "video", decorative: true, mobile: undefined, desktop: { src: "/media/qa-only.mp4", poster: image.desktop } };
  expect(approvedMedia("hero", { hero: video })).toEqual(video);
  expect(approvedMedia("hero", { hero: { ...video, desktop: { ...video.desktop, poster: { ...image.desktop, src: "/media/../private.png" } } } })).toBeNull();
  const normal = { reducedMotion: false, mobile: false };
  expect(videoPlaybackPolicy(normal)).toBe("desktop");
  expect(videoPlaybackPolicy({ ...normal, mobile: true })).toBe("mobile");
  expect(videoPlaybackPolicy({ ...normal, reducedMotion: true })).toBe("off");
  expect(videoPlaybackPolicy({ ...normal, saveData: true })).toBe("off");
  for (const effectiveType of ["slow-2g", "2g", "3g"]) expect(videoPlaybackPolicy({ ...normal, effectiveType })).toBe("off");
  const html = renderToStaticMarkup(<AmbientVideo asset={{ type: "video", desktop: video.desktop }}><span>Poster</span></AmbientVideo>);
  expect(html).toContain('preload="none"');
  expect(html).not.toContain("qa-only.mp4");
  expect(html).not.toContain("autoPlay");
});

test("verificador real y hooks de build usan el manifiesto", () => {
  const result = spawnSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "scripts/verify-media.mjs"], { encoding: "utf8", windowsHide: true });
  expect(result.status).toBe(0);
  expect(result.stdout).toContain("Medios aprobados verificados: 38");
  expect(verifyManifest({ hero: image })).toEqual({ files: 2, errors: [] });
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  expect(pkg.scripts.prebuild).toBe("npm run verify:media");
});

test("Home muestra fotografías licenciadas de destinos y solo el video decorativo del hero", async ({ page }) => {
  const videos: string[] = [];
  page.on("request", request => { if (/\.(mp4|webm)(?:[?#]|$)/.test(request.url())) videos.push(new URL(request.url()).pathname); });
  await page.goto("/");
  const video = page.locator("video");
  await expect(video).toHaveCount(1);
  await expect(page.locator("[data-scenic-hero] video")).toHaveCount(1);
  for (const [name, value] of [["aria-hidden", "true"], ["preload", "none"], ["tabindex", "-1"]]) await expect(video).toHaveAttribute(name, value);
  expect(await video.evaluate(element => (element as HTMLVideoElement).muted && (element as HTMLVideoElement).loop)).toBe(true);
  // With reduced motion (the suite's default) only the poster shows and nothing is downloaded.
  await expect(page.getByRole("button", { name: /video de fondo/ })).toHaveCount(0);
  await expect(page.locator("[data-destination-carousel] .postcard-photo img")).toHaveCount(8);
  await expect(page.locator("[data-destination-carousel] .landscape")).toHaveCount(0);
  const sources = await page.locator("[data-destination-carousel] img").evaluateAll(images => images.map(image => image.getAttribute("src")));
  expect(new Set(sources).size).toBe(8);
  for (const source of sources) expect(source).toContain("/_next/image?url=%2Fmedia%2Fdestinations%2F");
  expect(videos).toEqual([]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.getByRole("button", { name: "Pausar video de fondo" })).toBeVisible();
  await expect.poll(() => video.evaluate(element => !(element as HTMLVideoElement).paused)).toBe(true);
  expect([...new Set(videos)]).toEqual([expect.stringMatching(/^\/media\/travel-days\/trips\/maestrazo-termas-(desktop|mobile)\.mp4$/)]);
});

test("las copias públicas son WebP optimizadas y no incluyen EXIF, XMP ni perfiles privados", () => {
  const paths = readdirSync("public/media/travel-days", { recursive: true }).map(String).filter(path => path.endsWith(".webp"));
  expect(paths).toHaveLength(34);
  for (const path of paths) {
    const data = readFileSync(resolve("public/media/travel-days", path));
    expect(data.length, path).toBeLessThan(110_000);
    expect(data.toString("ascii", 0, 4)).toBe("RIFF");
    expect(data.toString("ascii", 8, 12)).toBe("WEBP");
    for (let offset = 12; offset + 8 <= data.length;) {
      const chunk = data.toString("ascii", offset, offset + 4);
      expect(["EXIF", "XMP ", "ICCP"], path).not.toContain(chunk);
      const size = data.readUInt32LE(offset + 4);
      offset += 8 + size + (size % 2);
    }
  }
});

test("Nosotros muestra oficina y retratos autorizados con carga responsive y sin notas privadas", async ({ page }) => {
  const videos: string[] = [];
  page.on("request", request => { if (/\.(mp4|webm)(?:[?#]|$)/.test(request.url())) videos.push(request.url()); });
  await page.goto("/nosotros");
  const office = page.locator("figure .approved-media-picture img");
  await expect(office).toHaveAttribute("loading", "eager");
  await expect(office).toHaveAttribute("fetchpriority", "high");
  await expect(office).toHaveAttribute("alt", /Escritorios y sillas/);
  await expect(page.locator("[data-team-portrait]")).toHaveCount(7);
  for (const photo of await page.locator("[data-team-portrait] img").all()) {
    await expect(photo).toHaveAttribute("loading", "lazy");
    await expect(photo).toHaveAttribute("srcset", /.+/);
  }
  await expect(page.locator('[data-team-portrait] img[srcset*="dj-mosca"]')).toHaveCount(1);
  const html = await page.content();
  expect(html).not.toContain("Confirmación explícita del usuario");
  expect(html).not.toContain("fotos videos y contenido traveldays");
  expect(videos).toEqual([]);
});

test("fotos de destinos: licencia libre con atribución visible, WebP sin metadatos y sin duplicados", async ({ page }) => {
  const destinations = Object.entries(mediaManifest).filter(([slot]) => slot.startsWith("destination:"));
  expect(destinations).toHaveLength(8);
  for (const [slot, asset] of destinations) {
    expect(asset!.credit, slot).toBeDefined();
    expect(asset!.credit!.license).toMatch(/^CC BY(-SA)? [234]\.0$/);
    expect(asset!.credit!.source).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    expect(asset!.credit!.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\/licenses\/by(-sa)?\/[234]\.0\/$/);
  }
  const paths = readdirSync("public/media/destinations").filter(path => path.endsWith(".webp"));
  expect(paths).toHaveLength(8);
  const hashes = new Set<string>();
  for (const path of paths) {
    const data = readFileSync(resolve("public/media/destinations", path));
    expect(data.length, path).toBeLessThan(800_000);
    expect(data.toString("ascii", 8, 12)).toBe("WEBP");
    hashes.add(data.toString("base64", 0, 4096));
    for (let offset = 12; offset + 8 <= data.length;) {
      expect(["EXIF", "XMP ", "ICCP"], path).not.toContain(data.toString("ascii", offset, offset + 4));
      const size = data.readUInt32LE(offset + 4);
      offset += 8 + size + (size % 2);
    }
  }
  expect(hashes.size).toBe(8);
  await page.goto("/");
  const credits = page.locator("#destinos details");
  await credits.locator("summary").click();
  await expect(credits.locator("li")).toHaveCount(8);
  await expect(credits.getByRole("link", { name: /^CC BY/ })).toHaveCount(8);
});
