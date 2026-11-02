import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { resolveMedia } from "../src/features/media/files.ts";

// Reuse the image processor already supplied by Next; no new dependency.
const nextRequire = createRequire(import.meta.resolve("next/package.json"));
const sharp = nextRequire("sharp");
const office = resolveMedia("page:nosotros");
if (!office || office.type !== "image") throw new Error("Falta la fotografía de oficina autorizada para la imagen social.");
const photo = await sharp(resolve("public", `.${office.desktop.src}`)).resize(600, 630, { fit: "cover" }).png().toBuffer();
// The font is used to render pixels, not bundled or served. A font path can be
// supplied on other systems; Windows provides Arial locally.
const fontfile = process.argv[2] ?? join(process.env.WINDIR ?? "C:/Windows", "Fonts/arial.ttf");
async function text(value, font) {
  return sharp({ text: { text: `<span foreground="#ffffff">${value}</span>`, font, fontfile, rgba: true, dpi: 72 } }).png().toBuffer();
}
const artwork = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0e2038"/>
  <path d="M0 0H610V630H0Z" fill="#006cf9"/>
  <circle cx="74" cy="78" r="8" fill="#f58634"/>
</svg>`);
const image = await sharp(artwork).composite([
  { input: photo, left: 600, top: 0 },
  { input: await text("Travel Days", "Arial Bold 40"), left: 96, top: 52 },
  { input: await text("Tu próximo viaje\nempieza con\nuna charla.", "Arial Bold 55"), left: 62, top: 203 },
  { input: await text("Villa Dolores · Córdoba", "Arial 23"), left: 64, top: 516 },
]).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
writeFileSync(resolve("src/app/opengraph-image.jpg"), image);
console.log(`Imagen social: ${image.length} bytes; fuente autorizada ${office.desktop.src}`);
