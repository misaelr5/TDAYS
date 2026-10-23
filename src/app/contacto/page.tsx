import type { Metadata } from "next";
import { site, whatsappUrl } from "@/config/site";
import { Arrow } from "@/components/icons";
import { ContactForm } from "@/features/contact/contact-form";
import { publishedDestinations } from "@/features/destinations/data";
import styles from "@/features/contact/contact.module.css";
export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Hablá con Travel Days por WhatsApp o visitanos en Felipe Erdman 222, Villa Dolores, Córdoba.",
};
export default function ContactPage() {
  return (
    <main id="contenido" className="interior-page">
      <section className={styles.intro} aria-labelledby="contact-title">
        <span className="section-index">/ CONTACTO</span>
        <h1 id="contact-title">HABLEMOS DE TU VIAJE.</h1>
        <p>
          Si estás pensando en viajar, contanos tu idea. Si ya viajaste con
          nosotros, queremos saber cómo fue tu experiencia.
        </p>
        <div className={styles.actions}>
          <a className={styles.action} href="#consulta">
            Quiero organizar un viaje
            <Arrow />
          </a>
          <a
            className={`${styles.action} ${styles.secondary}`}
            href="#experiencia"
          >
            Ya viajé con ustedes
            <Arrow />
          </a>
        </div>
      </section>
      <div className={styles.modules}>
        <section
          id="consulta"
          className={styles.module}
          aria-labelledby="inquiry-heading"
        >
          <p className={styles.moduleTag}>Tu próximo viaje</p>
          <h2 id="inquiry-heading">¿Adónde te gustaría ir?</h2>
          <p className={styles.moduleDescription}>
            Dejanos tu nombre y contanos qué estás buscando. No hace falta que
            tengas todo decidido para empezar a conversar.
          </p>
          <ContactForm
            kind="inquiry"
            destinations={publishedDestinations.flatMap((d) =>
              d.name ? [d.name] : [],
            )}
          />
        </section>
        <section
          id="experiencia"
          className={`${styles.module} ${styles.experience}`}
          aria-labelledby="experience-heading"
        >
          <p className={styles.moduleTag}>Ya viajaste con Travel Days</p>
          <h2 id="experience-heading">Tu experiencia nos importa.</h2>
          <p className={styles.moduleDescription}>
            Contanos qué disfrutaste y qué podríamos mejorar. Tu opinión llega
            como un mensaje privado, no como una reseña pública.
          </p>
          <ContactForm
            kind="experience"
            destinations={publishedDestinations.flatMap((d) =>
              d.name ? [d.name] : [],
            )}
          />
        </section>
      </div>
      <section className={styles.details} aria-labelledby="contact-options">
        <h2 id="contact-options">También podés encontrarnos acá.</h2>
        <div className={styles.detailsGrid}>
          <div>
            <h3>Hablemos directamente</h3>
            <a
              className="text-link"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribinos por WhatsApp
              <Arrow />
            </a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div>
            <h3>Vení a la agencia</h3>
            <p>{site.address}</p>
          </div>
          <div>
            <h3>Horarios de atención</h3>
            <p>{site.hours}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
