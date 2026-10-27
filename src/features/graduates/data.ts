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
      title: "Contanos del grupo",
      description:
        "Colegio, nivel, cantidad aproximada de personas y año en que quieren viajar. Podemos empezar aunque todavía no tengan todo definido.",
    },
    {
      title: "Conversemos el viaje",
      description:
        "Conversemos sobre destinos, fechas y lo que les gustaría vivir. Las preguntas de las familias también tienen su lugar.",
    },
    {
      title: "Revisemos la propuesta",
      description:
        "Consulten servicios, costos y condiciones de cada propuesta antes de tomar una decisión.",
    },
  ],
  questions: [
    {
      id: "egresados-destinos",
      topic: "Destinos y fechas",
      question: "¿Cómo elegimos destinos y fechas?",
      answer:
        "Contanos qué lugar les gustaría conocer y cuándo. Las opciones, fechas y disponibilidad se consultan para cada grupo; los ocho destinos del catálogo no son un listado de paquetes de egresados.",
    },
    {
      id: "egresados-contratacion",
      topic: "Antes de contratar",
      question: "¿Qué conviene revisar antes de contratar?",
      answer:
        "Antes de contratar, consulten transporte, alojamiento, comidas, actividades, coordinación, asistencia, documentación y condiciones de pago y cancelación. Los servicios incluidos y sus condiciones deben confirmarse en la propuesta de su grupo.",
    },
  ],
} as const;
