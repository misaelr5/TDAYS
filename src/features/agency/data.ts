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
export type TeamArea = "ventas" | "administracion" | "operacion" | "asistencia";
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  area?: TeamArea;
  description?: string;
  publication: { status: "pending" } | { status: "approved"; evidence: string };
};
// Publication approved by the user in the Nosotros redesign brief (25/10/2026).
const approval = { status: "approved", evidence: "Brief de rediseño Nosotros, aprobado por el usuario el 25/10/2026" } as const;
export const owner: TeamMember = { id: "javier-garay", name: "Javier Garay", role: "Propietario y gerente", publication: approval };
export const teamMembers: TeamMember[] = [
  owner,
  { id: "daiana-dascon", name: "Daiana D'Ascón", role: "Administración", area: "administracion", publication: approval },
  { id: "susana-romero", name: "Susana Romero", role: "Ventas", area: "ventas", publication: approval },
  { id: "jorge-picatto", name: "Jorge Picatto", role: "Ventas", area: "ventas", publication: approval },
  { id: "jorge-angelina", name: "Jorge Angelina", role: "Operaciones y coordinación general", area: "operacion", publication: approval },
  { id: "azul-barrera", name: "Azul Barrera", role: "Paramédica en viaje y destino", area: "asistencia", publication: approval },
  { id: "karoll-tello", name: "Karoll Tello", role: "Coordinación", area: "operacion", publication: approval },
  { id: "ezequiel-grego", name: "Ezequiel Grego", role: "Coordinación", area: "operacion", publication: approval },
];
export const teamAreas: { id: TeamArea; title: string; description: string }[] = [
  { id: "ventas", title: "Asesoramiento y ventas", description: "Destinos, fechas, servicios y condiciones antes de contratar." },
  { id: "administracion", title: "Administración", description: "El seguimiento de cada contratación y sus consultas." },
  { id: "operacion", title: "Operación y coordinación", description: "La preparación de los viajes y el acompañamiento de los grupos." },
  { id: "asistencia", title: "Asistencia en viaje", description: "Atención paramédica durante el viaje y en destino." },
];
export const credentials = {
  experienceYears: 23,
  founded: 2018,
  license: "18904",
  quality: "Calidad Turística, Nivel Bronce",
} as const;
export const training = [
  "Primeros auxilios, RCP y uso de DEA",
  "Manejo de grupos y emergencias",
  "Perspectiva de género",
  "Prevención del grooming y del bullying",
] as const;
