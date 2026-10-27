export type LocalMediaPath = `/media/${string}`;
export type MediaSlot = "hero" | "graduates" | "graduates-detail" | `school:${"primaria" | "primaria-detail" | "secundaria" | "maestros"}` | "page:destinos" | "page:inicio" | "page:nosotros" | "page:nosotros-historia" | "page:contacto" | `destination:${string}` | `team:${string}`;
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
// Scope is recorded per asset. Only authorized derivatives belong in public/;
// private originals and event photographs with pending permission stay outside.
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
  "school:primaria": {
    id: "school-group-building", type: "image",
    alt: "Grupo de estudiantes y acompañantes de Travel Days frente a un edificio de dos torres, durante una salida escolar.",
    provenance: "P169: egresados y fotos varisa/482197228_1221605856357025_5238093494456184970_n.jpg. SHA-256 baaea4384caff96a1bcdbb1b158e59b1d4f2dc260106cbf91540b7e5cd92bd87. WebP sin metadatos, proporción completa; docs/School-Media-Selection.csv.",
    authorization: { status: "approved", evidence: "Confirmación explícita del usuario del 27/10/2026: publicar las fotos de los chicos porque tenemos el permiso; identifica la carpeta egresados y fotos varisa y confirma material de ambos niveles. Abarca P168–P170, sus estudiantes y acompañantes; no las fotografías de la fiesta de El Maestrazo." },
    desktop: { src: "/media/travel-days/schools/school-group-building-desktop.webp", focal: { x: 50, y: 50 } },
    mobile: { src: "/media/travel-days/schools/school-group-building-mobile.webp", focal: { x: 50, y: 50 } },
  },
  "school:secundaria": {
    id: "school-group-lookout", type: "image",
    alt: "Estudiantes y acompañantes de Travel Days posan juntos en un mirador con una ciudad y sierras al fondo.",
    provenance: "P170: egresados y fotos varisa/591143606_18050933660664862_2957467923872386535_n.jpg. SHA-256 bbb7ed6d74185b4e6c71f87107e787b4a39d40c1b61db2fd7017b6a1bd939c63. WebP sin metadatos, proporción completa; docs/School-Media-Selection.csv.",
    authorization: { status: "approved", evidence: "Confirmación explícita del usuario del 27/10/2026: publicar las fotos de los chicos porque tenemos el permiso; identifica la carpeta egresados y fotos varisa y confirma material de ambos niveles. Abarca P168–P170, sus estudiantes y acompañantes; no las fotografías de la fiesta de El Maestrazo." },
    desktop: { src: "/media/travel-days/schools/school-group-lookout-desktop.webp", focal: { x: 50, y: 50 } },
    mobile: { src: "/media/travel-days/schools/school-group-lookout-mobile.webp", focal: { x: 50, y: 50 } },
  },
  "school:primaria-detail": {
    id: "school-group-port", type: "image",
    alt: "Grupo de estudiantes y acompañantes de Travel Days saludando junto a un puerto con barcos y grúas al fondo.",
    provenance: "P168: egresados y fotos varisa/1.jpg. SHA-256 e21107d8414de1f2e50053df1994e783d037c661d33f4978f38975df9e8fa7b2. WebP sin metadatos, proporción completa; docs/School-Media-Selection.csv.",
    authorization: { status: "approved", evidence: "Confirmación explícita del usuario del 27/10/2026: publicar las fotos de los chicos porque tenemos el permiso; identifica la carpeta egresados y fotos varisa y confirma material de ambos niveles. Abarca P168–P170, sus estudiantes y acompañantes; no las fotografías de la fiesta de El Maestrazo." },
    desktop: { src: "/media/travel-days/schools/school-group-port-desktop.webp", focal: { x: 50, y: 50 } },
    mobile: { src: "/media/travel-days/schools/school-group-port-mobile.webp", focal: { x: 50, y: 50 } },
  },
  "school:maestros": {
    id: "maestrazo-group-poster", type: "image",
    alt: "Grupo de pasajeros de El Maestrazo con una bandera de Travel Days frente a montañas nevadas.",
    provenance: "Poster existente del fragmento autorizado V140 (0–3,5 s), IMG_2723maestrazo parte 3 termas crudos.mp4. Se reutilizan los WebP ya públicos, sin recortes adicionales. docs/School-Media-Audit.md",
    authorization: { status: "approved", evidence: "Reutilización del poster del video con permiso web explícito del usuario del 27/10/2026 para sus pasajeros adultos, registrado en el slot hero. No extiende permiso a P021, P046, P059 ni P168–P170." },
    desktop: { src: "/media/travel-days/trips/maestrazo-termas-desktop.webp", focal: { x: 50, y: 50 } },
    mobile: { src: "/media/travel-days/trips/maestrazo-termas-desktop.webp", focal: { x: 50, y: 50 } },
  },
  hero: {
    id: "maestrazo-termas", type: "video", decorative: true,
    alt: "",
    provenance: "Material del propietario: Videos/wetransfer_parte-3-maestrazo-videos-crudos_2026-09-14_1157/IMG_2723maestrazo parte 3 termas crudos.mp4, segundos 0 a 3,5. Sin audio ni metadatos, con fundido al azul de marca para el loop; 27/10/2026.",
    authorization: { status: "approved", evidence: "Confirmación explícita del usuario del 27/10/2026: hay permiso de los pasajeros para el uso web de este video y todos son mayores de edad. Grupo de pasajeros con rostros visibles, revisado visualmente." },
    desktop: { src: "/media/travel-days/trips/maestrazo-termas-desktop.mp4", poster: { src: "/media/travel-days/trips/maestrazo-termas-desktop.webp", focal: { x: 50, y: 58 } } },
    mobile: { src: "/media/travel-days/trips/maestrazo-termas-mobile.mp4", poster: { src: "/media/travel-days/trips/maestrazo-termas-mobile.webp", focal: { x: 46, y: 58 } } },
  },
  "page:inicio": {
    id: "office-sign", type: "image",
    alt: "Cartel de Viajes y Turismo con letras azules y naranjas sobre una pared blanca de la oficina de Travel Days.",
    provenance: "Foto de la oficina enviada por el usuario en la conversación del 27/10/2026. Interior sin personas; copia WebP sin metadatos.",
    authorization: { status: "approved", evidence: "Solicitud explícita del usuario del 27/10/2026: usar esta foto de la oficina en Inicio. Interior sin personas, revisado visualmente." },
    desktop: { src: "/media/travel-days/office/office-sign-desktop.webp", focal: { x: 48, y: 33 } },
    mobile: { src: "/media/travel-days/office/office-sign-mobile.webp", focal: { x: 48, y: 31 } },
  },
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
  "team:dj-mosca": portrait("dj-mosca", "Retrato de DJ Mosca, de logística, DJ y relaciones públicas.", "Retrato individual identificado por la agencia en DJ MOSCA- logística y DJ, RRPP.JPG (P007).", { x: 50, y: 40 }, { status: "approved", evidence: "Solicitud explícita del usuario del 27/10/2026: agregar a DJ Mosca (logística y DJ, RRPP) al equipo con este retrato." }),
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
