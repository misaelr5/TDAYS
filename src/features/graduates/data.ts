export const graduates = {
  consultationMessage:
    "Hola Travel Days, quiero consultar por un viaje de egresados para nuestro grupo. ¿Podemos conversar sobre destinos, fechas, servicios y condiciones?",
  /** Editorial framing per level; topics are what to bring to the first conversation, not included services. */
  levels: [
    {
      id: "primaria",
      label: "Primaria",
      kicker: "Egresados de primaria",
      title: "Su primera gran despedida.",
      description:
        "Cerrar la primaria, compartir con sus compañeros y animarse a una nueva experiencia. Las familias son parte de la conversación desde el primer mensaje.",
      topics: ["Colegio y curso", "Cantidad de chicos", "Preguntas de las familias"],
      caption: "Ilustración · una primera gran despedida",
      message:
        "Hola Travel Days, quiero consultar por un viaje de egresados de primaria para nuestro grupo. ¿Podemos conversar sobre destinos, fechas, servicios y condiciones?",
    },
    {
      id: "secundaria",
      label: "Secundaria",
      kicker: "Egresados de secundaria",
      title: "El viaje del que van a hablar siempre.",
      description:
        "Los recreos, las juntadas y todo lo que los trajo hasta acá. Cuéntennos cómo imaginan su próximo recuerdo juntos y lo conversamos con el grupo y las familias.",
      topics: ["Destino que imaginan", "Año de egreso", "Tamaño del grupo"],
      caption: "Ilustración · recuerdos por vivir",
      message:
        "Hola Travel Days, quiero consultar por un viaje de egresados de secundaria para nuestro grupo. ¿Podemos conversar sobre destinos, fechas, servicios y condiciones?",
    },
  ],
  steps: [
    {
      title: "Primero, ustedes",
      description:
        "Contanos de qué colegio son, si egresan de primaria o secundaria y qué viaje tienen en mente.",
    },
    {
      title: "Un viaje para su grupo",
      description:
        "Conversemos sobre destinos, fechas y lo que les gustaría vivir. Las preguntas de las familias también tienen su lugar.",
    },
    {
      title: "Todo claro antes de salir",
      description:
        "Consulten servicios, costos y condiciones de cada propuesta antes de tomar una decisión.",
    },
  ],
  questions: [
    {
      question: "¿Por dónde empezamos?",
      answer:
        "Escribinos con el nombre del colegio, el nivel, la cantidad aproximada de personas y el año en que les gustaría viajar. Si todavía no tienen todo definido, podemos empezar por su idea.",
    },
    {
      question: "¿Qué destinos y fechas podemos consultar?",
      answer:
        "Contanos qué lugar les gustaría conocer y cuándo. Las opciones, fechas y disponibilidad se consultan para cada grupo; los ocho destinos del catálogo no son un listado de paquetes de egresados.",
    },
    {
      question: "¿Qué deberíamos revisar con las familias?",
      answer:
        "Antes de contratar, consulten transporte, alojamiento, comidas, actividades, coordinación, asistencia, documentación y condiciones de pago y cancelación. Los servicios incluidos y sus condiciones deben confirmarse en la propuesta de su grupo.",
    },
  ],
} as const;
