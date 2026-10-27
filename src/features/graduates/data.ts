export const graduates = {
  consultationMessage:
    "Hola Travel Days, quiero consultar por viajes escolares para nuestro grupo. ¿Podemos conversar sobre las opciones y condiciones?",
  /** Editorial framing per level; topics are what to bring to the first conversation, not included services. */
  levels: [
    {
      id: "primaria",
      label: "Primaria",
      kicker: "Egresados de primaria",
      title: "El primer viaje se prepara juntos.",
      description:
        "Un viaje con sus compañeros empieza con las preguntas de las familias. Contanos de qué colegio son y qué les gustaría organizar.",
      detail: "Conversemos sobre el destino, la coordinación y las dudas de las familias. Antes de decidir, revisamos qué incluye la propuesta y cómo se acompañaría al grupo.",
      cta: "Consultar por primaria",
      mediaSlot: "school:primaria",
      topics: ["Colegio y curso", "Cantidad de chicos", "Preguntas de las familias"],
      caption: "Ilustración · una primera gran despedida",
      message:
        "Hola Travel Days, quiero consultar por un viaje de egresados de primaria para nuestro grupo. ¿Podemos conversar sobre destinos, fechas, servicios y condiciones?",
    },
    {
      id: "secundaria",
      label: "Secundaria",
      kicker: "Egresados de secundaria",
      title: "Un viaje con su propio grupo.",
      description:
        "Después de tantos años de compartir el aula, toca pensar el viaje. Contanos qué imaginan y empecemos a organizarlo con el grupo y las familias.",
      detail: "Pueden acercarse con una idea o con un destino en mente. Las fechas, actividades, coordinación y condiciones se conversan y se confirman en la propuesta de cada grupo.",
      cta: "Consultar por secundaria",
      mediaSlot: "school:secundaria",
      topics: ["Destino que imaginan", "Año de egreso", "Tamaño del grupo"],
      caption: "Ilustración · recuerdos por vivir",
      message:
        "Hola Travel Days, quiero consultar por un viaje de egresados de secundaria para nuestro grupo. ¿Podemos conversar sobre destinos, fechas, servicios y condiciones?",
    },
    {
      id: "maestros",
      label: "Maestros",
      kicker: "Para docentes",
      title: "El Maestrazo.",
      description: "También hay un lugar para quienes están del otro lado del aula. Si son docentes y quieren conocer El Maestrazo, conversemos.",
      detail: "Contanos cuántos son y qué les gustaría saber. El equipo les informa las opciones, fechas y condiciones de El Maestrazo; los recuerdos de un viaje anterior no describen una próxima propuesta.",
      topics: ["Grupo de docentes", "Cantidad de personas", "Qué quieren consultar"],
      caption: "El Maestrazo · un recuerdo compartido",
      cta: "Consultar por El Maestrazo",
      mediaSlot: "school:maestros",
      message: "Hola Travel Days, somos un grupo de docentes y queremos consultar por El Maestrazo. ¿Podemos conversar sobre opciones, fechas y condiciones?",
    },
  ],
  steps: [
    {
      title: "Contanos del grupo",
      description:
        "Colegio o grupo de docentes, cantidad aproximada de personas y cuándo les gustaría viajar. Podemos empezar aunque todavía no tengan todo definido.",
    },
    {
      title: "Conversemos el viaje",
      description:
        "Destinos, fechas y lo que les gustaría hacer. Para los grupos de estudiantes, las preguntas de las familias también tienen su lugar.",
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
        "Contanos qué lugar les gustaría conocer y cuándo. Las opciones, fechas y disponibilidad se consultan para cada grupo; los ocho destinos del catálogo no son un listado de paquetes escolares ni de El Maestrazo.",
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
