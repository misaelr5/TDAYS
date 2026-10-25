export type MessageKind = "inquiry" | "experience";
export const contactLimits = {
  name: 80,
  phone: 25,
  destination: 100,
  message: 1500,
} as const;
export type ContactField = keyof typeof contactLimits | "rating";
type DraftResult =
  { ok: true; message: string } | { ok: false; field: ContactField; error: string };
function hasVisibleText(value: string) { return value.replace(/[\p{White_Space}\p{Cf}]/gu, "").length > 0; }

export function prepareMessage(data: FormData, kind: MessageKind): DraftResult {
  const read = (key: string) => {
    const value = data.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  const name = read("name");
  const phone = read("phone");
  const destination = read("destination");
  const message = read("message");
  const rating = read("rating");
  if (kind === "inquiry" && !hasVisibleText(name))
    return {
      ok: false,
      field: "name",
      error: "Escribí tu nombre para preparar la consulta.",
    };
  for (const [field, value] of Object.entries({
    name,
    phone,
    destination,
    message,
  })) {
    if (value.length > contactLimits[field as keyof typeof contactLimits])
      return {
        ok: false,
        field: field as ContactField,
        error: `Usá hasta ${contactLimits[field as keyof typeof contactLimits]} caracteres.`,
      };
  }
  if (
    phone &&
    (!/^[+\d\s().-]+$/.test(phone) ||
      phone.replace(/\D/g, "").length < 7 ||
      phone.replace(/\D/g, "").length > 15)
  )
    return {
      ok: false,
      field: "phone",
      error:
        "Revisá el teléfono: incluí entre 7 y 15 dígitos, con código de área.",
    };
  if (!hasVisibleText(message))
    return {
      ok: false,
      field: "message",
      error:
        kind === "inquiry"
          ? "Contanos qué viaje tenés en mente."
          : "Escribí cómo fue tu experiencia antes de continuar.",
    };
  if (kind === "experience" && rating && !/^[1-5]$/.test(rating))
    return {
      ok: false,
      field: "rating",
      error: "Elegí una puntuación de 1 a 5 o dejala sin puntuar.",
    };
  return {
    ok: true,
    message: [
      kind === "inquiry"
        ? "Hola Travel Days, quiero organizar un viaje."
        : "Hola Travel Days, ya viajé con ustedes y quiero compartir mi experiencia.",
      name ? `Nombre: ${name}` : null,
      kind === "inquiry" && phone ? `Teléfono de contacto: ${phone}` : null,
      destination
        ? `${kind === "inquiry" ? "Destino que me interesa" : "Viaje realizado"}: ${destination}`
        : null,
      kind === "experience"
        ? `Puntuación: ${rating ? `${rating}/5` : "sin puntuar"}`
        : null,
      `${kind === "inquiry" ? "Consulta" : "Experiencia"}: ${message}`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  };
}
