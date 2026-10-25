// Editorial adaptation of Docs/Cuestionario_Travel_Days_Reac_Studio.docx.
// No dates inferred from age or declared years of experience.
export const timeline = [
  {
    marker: "17 años",
    title: "El primer encuentro con el turismo",
    description:
      "Javier empieza promocionando viajes de egresados en las puertas de los colegios. Aprende a escuchar a estudiantes y familias.",
  },
  {
    marker: "El recorrido",
    title: "Ventas, operación y coordinación",
    description:
      "Reuniones, contratos y ventas dan paso a la supervisión y la gerencia. Suma coordinación, operación, viajes educativos y grupos nacionales e internacionales.",
  },
  {
    marker: "2018",
    title: "Nace Travel Days",
    description:
      "La experiencia se transforma en una agencia propia en Villa Dolores, con una identidad centrada en el diálogo y la atención personal.",
  },
  {
    marker: "Hoy",
    title: "Los servicios de la agencia",
    description:
      "Turismo nacional, internacional y receptivo; viajes educativos y de egresados de primaria y secundaria.",
  },
] as const;
export const agencyValues = [
  {
    title: "Honestidad",
    description:
      "Hablar con claridad sobre cada propuesta y orientar la elección del viaje.",
  },
  {
    title: "Transparencia",
    description:
      "Dar espacio a las preguntas sobre condiciones, servicios y contratación antes de decidir.",
  },
  {
    title: "Seriedad",
    description:
      "Revisar transporte, alojamiento, comidas y excursiones al conversar sobre una propuesta.",
  },
  {
    title: "Responsabilidad",
    description:
      "Considerar quiénes viajan y las necesidades del grupo al preparar una propuesta.",
  },
  {
    title: "Cumplimiento",
    description:
      "Trabajar sobre los servicios y las condiciones acordados al contratar.",
  },
  {
    title: "Cercanía",
    description:
      "Escuchar en persona, con oficina local y la posibilidad de hablar con el dueño.",
  },
  {
    title: "Calidad de servicio",
    description:
      "Atender consultas antes de contratar y durante el viaje.",
  },
  {
    title: "Atención humana",
    description:
      "Dedicar tiempo a las dudas y buscar respuestas ante inquietudes e imprevistos.",
  },
] as const;
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  description?: string;
  publication: { status: "pending" } | { status: "approved"; evidence: string };
};
// Questionnaire inventory; client explicitly left publication pending in Sprint 04.
export const teamMembers: TeamMember[] = [
  {
    id: "javier-garay",
    name: "Javier Garay",
    role: "Propietario y gerente",
    publication: { status: "pending" },
  },
  {
    id: "daiana-dascon",
    name: "Daiana Dascon",
    role: "Administración",
    publication: { status: "pending" },
  },
  {
    id: "susana-romero",
    name: "Susana Romero",
    role: "Ventas",
    publication: { status: "pending" },
  },
  {
    id: "jorge-picatto",
    name: "Jorge Picatto",
    role: "Ventas",
    publication: { status: "pending" },
  },
  {
    id: "jorge-angelina",
    name: "Jorge Angelina",
    role: "Operaciones y coordinación general",
    publication: { status: "pending" },
  },
  {
    id: "azul-barrera",
    name: "Azul Barrera",
    role: "Paramédica en viaje y destino",
    publication: { status: "pending" },
  },
  {
    id: "karoll-tello",
    name: "Karoll Tello",
    role: "Coordinación",
    publication: { status: "pending" },
  },
  {
    id: "ezequiel-grego",
    name: "Ezequiel Grego",
    role: "Coordinación",
    publication: { status: "pending" },
  },
];
export const teamAreas = [
  {
    title: "Asesoramiento y ventas",
    description:
      "Las consultas sobre destinos, fechas, servicios y condiciones antes de contratar.",
  },
  {
    title: "Administración",
    description:
      "El seguimiento de la información y las consultas de cada contratación.",
  },
  {
    title: "Operación y coordinación",
    description:
      "La preparación de los viajes y la coordinación de los grupos.",
  },
] as const;
