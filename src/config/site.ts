export const site = {
  name: "Travel Days",
  phone: "+54 9 3544 312904",
  whatsapp: "5493544312904",
  email: "info@traveldays.tur.ar",
  reservationsEmail: "reservastraveldays@gmail.com",
  address: "Felipe Erdman 222, Villa Dolores, Córdoba",
  hours: "Lunes a viernes de 9 a 12:30 y de 17 a 20:30. Sábados de 9 a 12:30.",
  instagram: "https://www.instagram.com/traveldays_1/",
  facebook: "https://www.facebook.com/traveldayseducativos",
  googleReviewsUrl: "https://share.google/1j7Yivr2gGxjZ16Xe",
} as const;
export function whatsappUrl(
  message = "Hola Travel Days, quiero consultar por un viaje. Me interesa saber las fechas, el precio y qué incluye.",
) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message.toWellFormed())}`;
}
