import { site } from "@/config/site";
import { credentials } from "@/features/agency/data";

export const termsUpdated = { iso: "2026-10-26", label: "26 de octubre de 2026" } as const;

export type TermsSection = { id: string; title: string; paragraphs?: string[]; items?: string[] };

// Plain-language terms for an Argentine travel agency. Review with the agency's legal advisor before publishing.
export const termsSections: TermsSection[] = [
  {
    id: "quienes-somos",
    title: "Quiénes somos",
    paragraphs: [
      `Travel Days es una agencia de viajes con oficina en ${site.address}. Opera bajo el Legajo N.º ${credentials.license} del Ministerio de Turismo y Deportes de la Nación, conforme a la Ley 18.829 y su Decreto reglamentario 2182/72.`,
      `Estos términos regulan el uso de este sitio web y las condiciones generales con las que respondemos consultas y organizamos viajes. Al navegar el sitio o enviarnos una consulta, aceptás estas condiciones.`,
    ],
  },
  {
    id: "uso-del-sitio",
    title: "Uso del sitio",
    paragraphs: [
      "Este sitio es informativo. Los destinos, fotos y descripciones son orientativos y no constituyen una oferta cerrada ni una reserva.",
      "No vendemos ni cobramos a través del sitio. Las consultas que enviás por el formulario o por WhatsApp sirven para empezar una conversación con nuestro equipo.",
    ],
    items: [
      "Usá el sitio de buena fe y sin intentar dañarlo, alterarlo ni acceder a áreas no públicas.",
      "No envíes datos de terceros sin su autorización.",
      "Podemos actualizar, corregir o retirar contenidos en cualquier momento.",
    ],
  },
  {
    id: "consultas-y-presupuestos",
    title: "Consultas y presupuestos",
    paragraphs: [
      "Cada viaje se cotiza a medida. Los presupuestos se envían por escrito e indican qué servicios incluyen, su vigencia y las condiciones de pago y cancelación que correspondan.",
      "Los precios y la disponibilidad dependen de los prestadores (transporte, alojamiento, excursiones) y pueden variar hasta que el viaje quede confirmado. Si algo cambia, te lo informamos antes de que confirmes.",
    ],
  },
  {
    id: "reservas-y-pagos",
    title: "Reservas y pagos",
    paragraphs: [
      "Una reserva queda confirmada cuando recibimos el pago inicial acordado y te enviamos la confirmación por escrito. Las condiciones particulares de cada viaje (forma de pago, cuotas, fechas límite y documentación) se detallan en la propuesta o en el contrato que firmás.",
      "Las condiciones particulares de cada propuesta prevalecen sobre estas condiciones generales en todo lo que regulen de forma específica.",
    ],
  },
  {
    id: "cambios-y-cancelaciones",
    title: "Cambios y cancelaciones",
    paragraphs: [
      "Si necesitás cambiar o cancelar un viaje, avisanos por escrito lo antes posible. Los cargos dependen de la anticipación del aviso y de las políticas de cada prestador, y se informan en la propuesta de tu viaje.",
      "Cuando la contratación se realice a distancia, podés ejercer el derecho de revocación dentro de los diez días corridos que prevé la Ley 24.240 de Defensa del Consumidor, en los casos en que corresponda.",
      "Si por causas ajenas a la agencia (clima, fuerza mayor, decisiones de prestadores o autoridades) un servicio se modifica o cancela, te ofreceremos alternativas equivalentes o el reintegro que corresponda según las condiciones del prestador.",
    ],
  },
  {
    id: "documentacion",
    title: "Documentación y requisitos de viaje",
    paragraphs: ["Cada pasajero es responsable de viajar con la documentación vigente y de cumplir los requisitos del destino. Te orientamos, pero la verificación final es tuya."],
    items: [
      "DNI o pasaporte vigente, según el destino.",
      "Visas, vacunas o certificados sanitarios que exija cada país.",
      "Autorizaciones de viaje para menores de edad, cuando corresponda.",
    ],
  },
  {
    id: "egresados",
    title: "Viajes de egresados y turismo estudiantil",
    paragraphs: [
      "Los viajes de egresados de primaria y secundaria se rigen, además, por la Ley 25.599 de Turismo Estudiantil y su normativa complementaria. Cada grupo recibe un contrato propio que firman las madres, padres o tutores, con el detalle de servicios, coordinación, asistencia, seguros y condiciones de pago y cancelación.",
    ],
  },
  {
    id: "responsabilidad",
    title: "Nuestra responsabilidad",
    paragraphs: [
      "Travel Days actúa como intermediaria entre vos y los prestadores de cada servicio, en los términos del Decreto 2182/72. Seleccionamos prestadores con cuidado y te acompañamos antes y durante el viaje.",
      "No respondemos por hechos de fuerza mayor ni por incumplimientos atribuibles exclusivamente a terceros, sin perjuicio de las gestiones que hagamos para ayudarte y de los derechos que te reconoce la ley.",
    ],
  },
  {
    id: "asistencia",
    title: "Seguros y asistencia al viajero",
    paragraphs: ["La asistencia al viajero y los seguros se incluyen solo cuando la propuesta lo indica expresamente. Si no están incluidos, te recomendamos contratarlos y podemos asesorarte."],
  },
  {
    id: "datos-personales",
    title: "Datos personales",
    paragraphs: [
      "Usamos los datos que nos enviás (nombre, teléfono, email y detalles del viaje) solo para responder tu consulta y gestionar tu viaje. No los vendemos ni los cedemos a terceros, salvo a los prestadores necesarios para concretar los servicios contratados.",
      `Podés pedir acceso, rectificación o supresión de tus datos escribiendo a ${site.email}, conforme a la Ley 25.326 de Protección de Datos Personales.`,
      "La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.",
    ],
  },
  {
    id: "propiedad-intelectual",
    title: "Contenidos e imágenes",
    paragraphs: ["Los textos, fotos, ilustraciones y la marca Travel Days pertenecen a la agencia o se usan con autorización. No pueden copiarse ni reutilizarse con fines comerciales sin nuestro permiso escrito."],
  },
  {
    id: "enlaces",
    title: "Enlaces a otros sitios",
    paragraphs: ["El sitio incluye enlaces a WhatsApp, Instagram, Facebook, Google Maps y otros servicios. Esos sitios tienen sus propias condiciones y políticas de privacidad, ajenas a Travel Days."],
  },
  {
    id: "cambios",
    title: "Cambios en estos términos",
    paragraphs: ["Podemos actualizar estos términos. La versión vigente es la publicada en esta página, con su fecha de actualización. Los cambios no afectan viajes ya confirmados, que se rigen por las condiciones aceptadas al contratar."],
  },
  {
    id: "ley-aplicable",
    title: "Ley aplicable y reclamos",
    paragraphs: [
      "Estos términos se rigen por las leyes de la República Argentina. Ante cualquier inconveniente, escribinos primero: la mayoría de las situaciones se resuelven conversando.",
      "Si sos consumidor, conservás tu derecho a reclamar ante la autoridad de defensa del consumidor y ante los tribunales que correspondan según la Ley 24.240.",
    ],
  },
];
