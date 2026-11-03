import { resolveMedia } from "@/features/media/files";
import { site, whatsappUrl } from "@/config/site";
import { TestimonialPlayer, type Testimonial } from "./testimonial-player";

export function TestimonialsSection() {
  const testimonials: Testimonial[] = [];
  for (const definition of [
    { id: "primaria", title: "Viajes de primaria", description: "Una experiencia compartida frente a cámara.", durationSeconds: 74.68, width: 480, height: 848 },
    { id: "pasajeros-2024", title: "Voces del viaje", description: "Pasajeros que cuentan su experiencia al aire libre.", durationSeconds: 123.72, width: 478, height: 850 },
  ] as const) {
    const video = resolveMedia(`testimonial:${definition.id}`);
    if (video?.type === "video" && !video.decorative) testimonials.push({ ...definition, video });
  }
  if (!testimonials.length) return null;
  return <TestimonialPlayer
    testimonials={testimonials}
    contactHref={whatsappUrl("Hola Travel Days, vi los testimonios y quiero consultar por un viaje para nuestro grupo.")}
    reviewsHref={site.googleReviewsUrl}
  />;
}
