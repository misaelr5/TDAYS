export type Destination = {
  slug: string;
  name: string | null;
  description: string | null;
  /** Editorial labels and WhatsApp drafts, not confirmation of a bookable departure. */
  consultation?: { label: string; message: string };
  category: "Internacional" | "Nacional" | "Receptivo" | null;
  /** Short confirmed region shown beside the category; omit when unconfirmed. */
  location?: string;
  /** Content inventory; publication uses the authorized destination:slug slot in config/media.ts. */
  images: { src: string; alt: string }[];
  dates: { departure: string; return: string | null }[];
  price: { amount: number; currency: "ARS" | "USD" } | null;
  services: string[];
  itinerary: { day: number; description: string }[];
  status: "published" | "draft";
  artwork: "coast" | "islands" | "mountains" | "falls" | "road" | "festival";
};
const empty = {
  description: null,
  images: [],
  dates: [],
  price: null,
  services: [],
  itinerary: [],
};
export const destinations: Destination[] = [
  {
    ...empty,
    slug: "brasil",
    name: "Brasil",
    description:
      "¿Playa, ciudad o un poco de las dos? Contanos qué parte de Brasil te interesa y cuándo pensás viajar.",
    consultation: {
      label: "Consultar por Brasil",
      message:
        "Hola Travel Days, quiero consultar por Brasil. ¿Qué opciones podemos evaluar para mis fechas y desde dónde sería la salida?",
    },
    category: "Internacional",
    status: "published",
    artwork: "coast",
  },
  {
    ...empty,
    slug: "caribe",
    name: "Caribe",
    description:
      "Si todavía no elegiste un destino del Caribe, contanos qué tipo de viaje buscás y en qué mes querés ir.",
    consultation: {
      label: "Consultar por el Caribe",
      message:
        "Hola Travel Days, me interesa viajar al Caribe. Quiero consultar qué destinos podemos evaluar, alojamiento y precio para mis fechas.",
    },
    category: "Internacional",
    status: "published",
    artwork: "islands",
  },
  {
    ...empty,
    slug: "carnavales-de-jujuy",
    name: "Carnavales de Jujuy",
    description:
      "Decinos para qué año querés ir. Consultá la localidad, las fechas y el recorrido de la propuesta.",
    consultation: {
      label: "Consultar por carnavales",
      message:
        "Hola Travel Days, quiero consultar por Carnavales de Jujuy. ¿Qué localidades, fechas, recorrido y servicios contempla la propuesta?",
    },
    category: "Nacional",
    status: "published",
    artwork: "mountains",
  },
  {
    ...empty,
    slug: "cataratas-del-iguazu",
    name: "Cataratas del Iguazú",
    description:
      "Las Cataratas, en Misiones. Preguntanos por las visitas y el alojamiento que contempla cada propuesta.",
    consultation: {
      label: "Consultar por Cataratas",
      message:
        "Hola Travel Days, quiero consultar por Cataratas del Iguazú. Me interesa saber las fechas, las visitas, el alojamiento y el precio.",
    },
    category: "Nacional",
    location: "Misiones",
    status: "published",
    artwork: "falls",
  },
  {
    ...empty,
    slug: "los-tuneles",
    name: "Los Túneles",
    description:
      "Antes de organizar una visita, consultá el estado del acceso, el recorrido y la duración de la salida.",
    consultation: {
      label: "Consultar el recorrido",
      message:
        "Hola Travel Days, quiero consultar por Los Túneles. ¿Se puede organizar una visita para mi fecha? ¿Cómo está el acceso y cuál sería el recorrido, la duración y el precio?",
    },
    category: "Nacional",
    location: "Córdoba",
    status: "published",
    artwork: "road",
  },
  {
    ...empty,
    slug: "festival-de-jesus-maria",
    name: "Festival de Jesús María",
    description:
      "¿Para qué edición querés viajar? Consultá las opciones de traslado y si la propuesta contempla entradas.",
    consultation: {
      label: "Consultar por el festival",
      message:
        "Hola Travel Days, quiero consultar por el Festival de Jesús María. ¿Qué fechas se pueden evaluar, cómo sería el traslado y las entradas están incluidas o se compran aparte?",
    },
    category: "Nacional",
    location: "Córdoba",
    status: "published",
    artwork: "festival",
  },
  {
    ...empty,
    slug: "bayahibe",
    name: "Bayahíbe",
    description:
      "Un destino de playa en República Dominicana. Contanos cuántos días tenés y consultá las opciones de estadía.",
    consultation: {
      label: "Consultar por Bayahíbe",
      message:
        "Hola Travel Days, quiero consultar por Bayahíbe. Me interesa saber las opciones de alojamiento, las fechas y qué contempla el precio.",
    },
    category: "Internacional",
    location: "República Dominicana",
    status: "published",
    artwork: "coast",
  },
  {
    ...empty,
    slug: "valeria-del-mar",
    name: "Valeria del Mar",
    description:
      "En la costa bonaerense. Decinos cuántos días pensás quedarte y cuántas personas viajarían.",
    consultation: {
      label: "Consultar por Valeria",
      message:
        "Hola Travel Days, quiero consultar por Valeria del Mar. ¿Qué opciones de alojamiento podemos evaluar, para cuántas noches y a qué precio?",
    },
    category: "Nacional",
    location: "Buenos Aires",
    status: "published",
    artwork: "coast",
  },
];
export const publishedDestinations = destinations.filter(
  (destination) => destination.status === "published" && destination.name,
);

// Drafts reserve visual positions, never become published travel offers.
export const catalogPositions = destinations.map((destination) =>
  destination.status === "published" && destination.name
    ? { kind: "destination" as const, destination }
    : { kind: "pending" as const, id: destination.slug },
);

// Shared by the home gallery and the catalog card so the photo morphs between them.
export function destinationTransitionName(slug: string) {
  return `destination-photo-${slug}`;
}
