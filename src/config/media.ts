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
// Scope: the owner's empty office and individual staff portraits supplied for
// this integration. Passenger/event media and minors remain outside public/.
const officeApproval = { status: "approved", evidence: "Solicitud del usuario del 25/10/2026: integrar el material real provisto por el propietario; interior de oficina sin personas, revisado visualmente. docs/Media-Audit.md" } as const;
const portraitApproval = { status: "approved", evidence: "Confirmación explícita del usuario del 25/10/2026: los retratos individuales del equipo tienen permiso de uso web. No cubre acompañantes ni pasajeros. docs/Media-Audit.md" } as const;
function portrait(id: string, alt: string, provenance: string, focal: { x: number; y: number }): ImageAsset {
  return {
    id, type: "image", alt, provenance, authorization: portraitApproval,
    desktop: { src: `/media/travel-days/team/${id}-desktop.webp`, focal },
    mobile: { src: `/media/travel-days/team/${id}-mobile.webp`, focal },
  };
}
export const mediaManifest: MediaManifest = {
  "page:nosotros": {
    id: "office-consultation", type: "image",
    alt: "Escritorios y sillas de atención al público en la oficina de Travel Days, con el logo de la agencia sobre una pared azul.",
    provenance: "Material del propietario: Fotos/Foto interior Ofi 2.HEIC (P140). Interior sin personas; copia WebP sin metadatos. Auditoría visual del 25/10/2026.",
    authorization: officeApproval,
    desktop: { src: "/media/travel-days/office/office-consultation-desktop.webp", focal: { x: 50, y: 50 } },
    mobile: { src: "/media/travel-days/office/office-consultation-mobile.webp", focal: { x: 50, y: 50 } },
  },
  "team:javier-garay": portrait("javier-garay", "Javier Garay con indumentaria de Travel Days.", "Retrato individual provisto por el propietario e identificado en el archivo Javier Garay- propietario y gerente.HEIC (P142).", { x: 52, y: 39 }),
  "team:daiana-dascon": portrait("daiana-dascon", "Retrato de Daiana D'Ascón, del área de administración.", "Retrato individual identificado por la agencia en DAIANA dascon - administración.JPG (P006).", { x: 54, y: 34 }),
  "team:azul-barrera": portrait("azul-barrera", "Retrato de Azul Barrera, paramédica del equipo.", "Retrato individual identificado por la agencia en Azul barrera- Paramedica.JPG (P001).", { x: 51, y: 43 }),
  "team:karoll-tello": portrait("karoll-tello", "Retrato de Karoll Tello, del área de coordinación.", "Retrato individual identificado por la agencia en Karol Tello- coordinación.JPG (P147).", { x: 50, y: 35 }),
};

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
