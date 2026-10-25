import { readFileSync, mkdirSync, mkdtempSync, writeFileSync, symlinkSync } from "node:fs";
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
  expect(mediaManifest).toEqual({});
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
  expect(renderToStaticMarkup(<ApprovedMedia slot="hero"><span>Fallback de prueba</span></ApprovedMedia>)).toBe("<span>Fallback de prueba</span>");
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
  expect(result.stdout).toContain("Medios aprobados verificados: 0");
  expect(verifyManifest({ hero: image })).toEqual({ files: 2, errors: [] });
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  expect(pkg.scripts.prebuild).toBe("npm run verify:media");
});

test("Home no publica imágenes de viajes ni solicita video con manifiesto vacío", async ({ page }) => {
  const videos: string[] = [];
  page.on("request", request => { if (/\.(mp4|webm)(?:[?#]|$)/.test(request.url())) videos.push(request.url()); });
  await page.goto("/");
  await expect(page.locator("video, .postcard-photo")).toHaveCount(0);
  await expect(page.locator(".destination-card .landscape")).toHaveCount(8);
  expect(videos).toEqual([]);
});
