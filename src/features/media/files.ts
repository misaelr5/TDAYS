import { existsSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { approvedMedia, mediaManifest, type MediaAsset, type MediaManifest, type MediaSlot, type PublicMedia } from "../../config/media.ts";

export function mediaFileErrors(asset: MediaAsset, publicRoot = resolve("public")) {
  const errors: string[] = [];
  const variants = [asset.desktop, ...(asset.mobile ? [asset.mobile] : [])];
  const paths = variants.flatMap(variant => "poster" in variant ? [variant.src, variant.poster.src] : [variant.src]);
  const mediaRoot = resolve(publicRoot, "media");
  if (!existsSync(mediaRoot)) return ["Falta el directorio public/media"];
  const root = realpathSync(mediaRoot);
  for (const src of paths) {
    const path = resolve(publicRoot, `.${src}`);
    // These files are served from public/, not bundled into server code. Avoid
    // tracing dynamic fixture roots (and accidentally packaging private sources).
    if (!existsSync(/* turbopackIgnore: true */ path) || !statSync(/* turbopackIgnore: true */ path).isFile()) { errors.push(`Falta el archivo ${src}`); continue; }
    const location = relative(root, realpathSync(/* turbopackIgnore: true */ path));
    if (isAbsolute(location) || location === ".." || location.startsWith(`..${sep}`)) errors.push(`Archivo fuera de media: ${src}`);
  }
  return errors;
}
export function verifyManifest(manifest: MediaManifest = mediaManifest, publicRoot = resolve("public")) {
  const errors: string[] = [];
  let files = 0;
  for (const [slot, asset] of Object.entries(manifest)) {
    if (!asset || asset.authorization.status !== "approved") continue;
    const approved = approvedMedia(slot as MediaSlot, manifest);
    if (!approved) { errors.push(`${slot}: autorización, procedencia, texto, ruta o foco inválidos`); continue; }
    const failures = mediaFileErrors(approved, publicRoot);
    errors.push(...failures.map(message => `${slot}: ${message}`));
    if (!failures.length) files += (approved.mobile ? 2 : 1) * (approved.type === "video" ? 2 : 1);
  }
  return { files, errors };
}
export function resolveMedia(slot: MediaSlot, manifest: MediaManifest = mediaManifest, publicRoot = resolve("public")): PublicMedia | null {
  const asset = approvedMedia(slot, manifest);
  if (!asset || mediaFileErrors(asset, publicRoot).length) return null;
  // Deliberately omit authorization, provenance and internal identifiers.
  return asset.type === "image"
    ? { type: "image", alt: asset.alt, desktop: asset.desktop, mobile: asset.mobile }
    : { type: "video", desktop: asset.desktop, mobile: asset.mobile };
}
