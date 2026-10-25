export type LocalMediaPath = `/media/${string}`;
export type MediaSlot = "hero" | "graduates" | "graduates-detail" | "page:destinos" | "page:nosotros" | "page:contacto" | `destination:${string}` | `team:${string}`;
export type ImageSource = { src: LocalMediaPath; focal: { x: number; y: number } };
type MediaBase = {
  id: string;
  alt: string;
  provenance: string;
  authorization: { status: "pending" | "rejected" } | { status: "approved"; evidence: string };
};
export type ImageAsset = MediaBase & { type: "image"; desktop: ImageSource; mobile?: ImageSource };
export type VideoAsset = MediaBase & {
  type: "video";
  decorative: true;
  desktop: { src: LocalMediaPath; poster: ImageSource };
  mobile?: { src: LocalMediaPath; poster: ImageSource };
};
export type MediaAsset = ImageAsset | VideoAsset;
export type MediaManifest = Partial<Record<MediaSlot, MediaAsset>>;
export type PublicImage = Pick<ImageAsset, "type" | "alt" | "desktop" | "mobile">;
export type PublicVideo = Pick<VideoAsset, "type" | "desktop" | "mobile">;
export type PublicMedia = PublicImage | PublicVideo;

// Publication decisions and their evidence are consumed on the server only.
// No travel photograph or footage has been authorized locally.
export const mediaManifest: MediaManifest = {};

export function validMediaPath(path: string, type: "image" | "video") {
  const extension = type === "image" ? /\.(?:png|jpe?g|webp|avif)$/ : /\.(?:mp4|webm)$/;
  return typeof path === "string" &&
    /^\/media\/[a-z0-9][a-z0-9._/-]*$/.test(path) && extension.test(path) &&
    path.split("/").slice(2).every(part => part !== "" && part !== "." && part !== "..");
}
function validImage(source: ImageSource) {
  return source && validMediaPath(source.src, "image") && source.focal &&
    [source.focal.x, source.focal.y].every(value => Number.isFinite(value) && value >= 0 && value <= 100);
}
export function approvedMedia(slot: MediaSlot, manifest: MediaManifest = mediaManifest): MediaAsset | null {
  const asset = manifest[slot];
  if (!asset || asset.authorization?.status !== "approved" ||
    !asset.authorization.evidence?.trim() || !asset.provenance?.trim() ||
    !asset.id?.trim() || typeof asset.alt !== "string") return null;
  if (asset.type === "image") {
    return asset.alt.trim() && validImage(asset.desktop) && (!asset.mobile || validImage(asset.mobile)) ? asset : null;
  }
  if (asset.type !== "video" || asset.decorative !== true) return null;
  const variants = [asset.desktop, ...(asset.mobile ? [asset.mobile] : [])];
  return variants.every(variant => variant && validMediaPath(variant.src, "video") && validImage(variant.poster)) ? asset : null;
}
