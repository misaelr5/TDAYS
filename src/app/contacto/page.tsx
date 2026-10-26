import { pageMetadata } from "@/config/metadata";
import { site } from "@/config/site";
import { Arrow } from "@/components/icons";
import { ContactExplorer } from "@/features/contact/contact-explorer";
import { ContactForm } from "@/features/contact/contact-form";
import { publishedDestinations } from "@/features/destinations/data";
import styles from "@/features/contact/contact.module.css";

export const metadata = pageMetadata("Contacto", "Hablá con Travel Days por WhatsApp o visitanos en Felipe Erdman 222, Villa Dolores, Córdoba.");

export default function ContactPage() {
  const destinations = publishedDestinations.flatMap(destination => destination.name ? [destination.name] : []);
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;
  return (
    <main id="contenido" className={`interior-page ${styles.page}`}>
      <header className={styles.intro}>
        <h1>Hablemos.</h1>
        <p>Un viaje por venir. Un recuerdo para compartir.</p>
      </header>

      <ContactExplorer>
        <section id="consulta" className={styles.panel} data-contact-panel="consulta" aria-labelledby="inquiry-heading">
          <div className={styles.panelHeading}>
            <h2 id="inquiry-heading">Tu próxima historia empieza acá.</h2>
            <p>Contanos tu idea. No hace falta tener todo decidido.</p>
          </div>
          <ContactForm kind="inquiry" destinations={destinations} />
        </section>

        <section id="oficina" className={styles.panel} data-contact-panel="oficina" aria-labelledby="office-heading">
          <div className={styles.panelHeading}>
            <h2 id="office-heading">Nos vemos en Villa Dolores.</h2>
            <p>Un lugar para sentarnos a conversar.</p>
          </div>
          <dl className={styles.officeDetails}>
            <div><dt>Nuestra oficina</dt><dd>{site.address}</dd></div>
            <div><dt>Horarios de atención</dt><dd>{site.hours}</dd></div>
          </dl>
          <div className={styles.officeLinks}>
            <a className={styles.utilityLink} href={directions} target="_blank" rel="noopener noreferrer">Cómo llegar <Arrow /></a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:+${site.whatsapp}`}>{site.phone}</a>
          </div>
        </section>

        <section id="experiencia" className={styles.panel} data-contact-panel="experiencia" aria-labelledby="experience-heading">
          <div className={styles.panelHeading}>
            <h2 id="experience-heading">El viaje sigue en tus recuerdos.</h2>
            <p>Si viajaste con nosotros, nos gustaría saber cómo fue.</p>
          </div>
          <ContactForm kind="experience" destinations={destinations} />
        </section>
      </ContactExplorer>
    </main>
  );
}
