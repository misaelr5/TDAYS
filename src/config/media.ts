export type LocalMediaPath = `/media/${string}`;
export type MediaSlot = "hero" | "graduates" | "graduates-detail" | "page:destinos" | "page:nosotros" | "page:nosotros-historia" | "page:contacto" | `destination:${string}` | `team:${string}`;
export type ImageSource = { src: LocalMediaPath; focal: { x: number; y: number } };
type MediaBase = {
  id: string;
  alt: string;
  provenance: string;
  authorization: { status: "pending" | "rejected" } | { status: "approved"; evidence: string };
  /** Public attribution required by third-party licenses (CC BY / BY-SA). */
  credit?: { author: string; license: string; licenseUrl: string; source: string };
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
// Folder portraits flagged in the 25/10 audit, published after the user's confirmation.
// Jorge's file is cropped to exclude the minors present in the original scene.
const folderPortraitApproval = { status: "approved", evidence: "Confirmación explícita del usuario del 26/10/2026: usar los retratos de Jorge Angelina y Ezequiel Grego de la carpeta del propietario. El recorte de Jorge excluye por completo a la menor y al fondo con personas. docs/Media-Audit.md" } as const;
function portrait(id: string, alt: string, provenance: string, focal: { x: number; y: number }, authorization: ImageAsset["authorization"] = portraitApproval): ImageAsset {
  return {
    id, type: "image", alt, provenance, authorization,
    desktop: { src: `/media/travel-days/team/${id}-desktop.webp`, focal },
    mobile: { src: `/media/travel-days/team/${id}-mobile.webp`, focal },
  };
}
// Third-party photographs: no client originals of the destinations exist yet
// (docs/Media-Audit.md). Each file is a crop of a Wikimedia Commons original whose
// license allows commercial use with attribution. docs/Media-Destinos.md
function commons(slug: string, alt: string, file: string, credit: { author: string; license: string }, focal: { x: number; y: number }): ImageAsset {
  const license = credit.license.replace(/^CC /, "").toLowerCase().split(" ");
  return {
    id: `destination-${slug}`, type: "image", alt,
    provenance: `Wikimedia Commons: File:${file}. Recorte y conversión WebP sin metadatos, 26/10/2026.`,
    authorization: { status: "approved", evidence: `Licencia ${credit.license} verificada en Wikimedia Commons el 26/10/2026; atribución visible en la sección. docs/Media-Destinos.md` },
    credit: {
      ...credit,
      licenseUrl: `https://creativecommons.org/licenses/${license[0]}/${license[1]}/`,
      source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(" ", "_"))}`,
    },
    desktop: { src: `/media/destinations/${slug}.webp`, focal },
  };
}
const destinationMedia: MediaManifest = {
  "destination:brasil": commons("brasil", "Baía do Sancho, en Fernando de Noronha, Brasil: playa de arena dorada entre acantilados con vegetación y mar turquesa.", "Fernando De Noronha Insel Baia Do Sancho (125362991).jpeg", { author: "Dronepicr", license: "CC BY 3.0" }, { x: 52, y: 50 }),
  "destination:caribe": commons("caribe", "Vista aérea de una playa de arena blanca y mar turquesa en el Caribe, rodeada de colinas verdes.", "Grote Knip Curacao (34800917861).jpg", { author: "dronepicr", license: "CC BY 2.0" }, { x: 50, y: 66 }),
  "destination:carnavales-de-jujuy": commons("carnavales-de-jujuy", "Dos diablos de carnaval con trajes de colores en las escalinatas del Monumento a los Héroes de la Independencia, en Humahuaca, Jujuy.", "Carnaval de Humahuaca 2026 Humahuaca Jujuy, Argentina.jpg", { author: "SanRoqueRemache", license: "CC BY-SA 4.0" }, { x: 66, y: 40 }),
  "destination:cataratas-del-iguazu": commons("cataratas-del-iguazu", "Saltos de las Cataratas del Iguazú entre la selva, con rocas y bruma al pie de la caída de agua.", "Iguazú Falls 07.jpg", { author: "Bernard Gagnon", license: "CC BY-SA 4.0" }, { x: 46, y: 45 }),
  "destination:los-tuneles": commons("los-tuneles", "Ruta de montaña que entra en uno de los túneles de Taninga, excavado en la roca de las sierras de Córdoba.", "Tunel 5, Los Tuneles de Taninga, Cordoba.jpg", { author: "AsterixCBA", license: "CC BY-SA 4.0" }, { x: 44, y: 70 }),
  "destination:festival-de-jesus-maria": commons("festival-de-jesus-maria", "Noche en el anfiteatro del Festival Nacional de Doma y Folklore de Jesús María, con tropillas en el campo y el público en las tribunas.", "Festival de la Doma y el Folklore Jesus María.jpg", { author: "Maria Jose Malnis", license: "CC BY-SA 2.0" }, { x: 42, y: 58 }),
  "destination:bayahibe": commons("bayahibe", "Palmera sobre la costa de Bayahíbe, República Dominicana, con aguas cristalinas y embarcaciones en la bahía.", "2023 - Bayahíbe - 05.jpg", { author: "Oleg Yunakov", license: "CC BY-SA 4.0" }, { x: 62, y: 58 }),
  "destination:valeria-del-mar": commons("valeria-del-mar", "Pasarela de madera entre los médanos con vegetación de Valeria del Mar, en la costa bonaerense.", "Pasarela en valeriadelmar 02.jpg", { author: "Fernando Martello", license: "CC BY-SA 4.0" }, { x: 38, y: 66 }),
};
export const mediaManifest: MediaManifest = {
  ...destinationMedia,
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
  "team:jorge-angelina": portrait("jorge-angelina", "Retrato de Jorge Angelina, de operaciones y coordinación general.", "Recorte de Jorge angelina- coordinación general.JPG (P146) que muestra solo a Jorge.", { x: 50, y: 40 }, folderPortraitApproval),
  "team:ezequiel-grego": portrait("ezequiel-grego", "Retrato de Ezequiel Grego, del área de coordinación.", "Retrato individual identificado por la agencia en Grego Ezequiel- coordinación.PNG (P141).", { x: 50, y: 45 }, folderPortraitApproval),
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
