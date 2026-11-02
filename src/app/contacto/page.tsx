import { pageMetadata } from "@/config/metadata";
import { site, whatsappUrl } from "@/config/site";
import { Arrow } from "@/components/icons";
import { ContactExplorer } from "@/features/contact/contact-explorer";
import { ContactForm } from "@/features/contact/contact-form";
import { publishedDestinations } from "@/features/destinations/data";
import { Sticker, TextSticker } from "@/components/stickers";
import styles from "@/features/contact/contact.module.css";
import agencyStyles from "@/features/agency/narrative.module.css";
import { OfficeMap } from "@/features/agency/office-map";

export const metadata = pageMetadata("Contacto", "Hablá con Travel Days por WhatsApp o visitanos en Felipe Erdman 222, Villa Dolores, Córdoba.", "/contacto");

export default function ContactPage() {
  const destinations = publishedDestinations.flatMap(destination => destination.name ? [destination.name] : []);
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;
  return (
    <main id="contenido" className={`interior-page ${styles.page}`}>
      <header className={styles.intro} data-intro-group>
        <div className={styles.introTitle}>
          <h1>Hablemos.</h1>
          <TextSticker at={{ top: "-6px", right: "0" }} tilt={10} size="clamp(14px, 1.6vw, 20px)">¡Hola!</TextSticker>
          <Sticker kind="plane" at={{ bottom: "-8px", left: "0" }} tilt={-18} size="clamp(42px, 5vw, 72px)" />
        </div>
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

        <section id="oficina" className={`${styles.panel} ${styles.officePanel}`} data-contact-panel="oficina" aria-labelledby="office-heading">
          <div className={agencyStyles.closingPanel}>
            <div className={agencyStyles.closingCopy}>
              <h2 id="office-heading">Pasá por la oficina o escribinos.</h2>
              <p className={agencyStyles.closingLead}>Contanos qué viaje tenés en mente. Te responde alguien del equipo, con nombre y apellido.</p>
              <dl className={agencyStyles.contactList}>
                <div><dt>Horarios</dt><dd>{site.hours}</dd></div>
                <div><dt>WhatsApp</dt><dd>{site.phone}</dd></div>
              </dl>
              <div className={agencyStyles.heroActions}>
                <a className={agencyStyles.light} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp <Arrow /></a>
              </div>
              <div className={styles.officeExtraLinks}>
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <a href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
            </div>
            <OfficeMap address={site.address} directions={directions} />
          </div>
        </section>

        <section id="experiencia" className={styles.panel} data-contact-panel="experiencia" aria-labelledby="experience-heading">
          <div className={styles.panelHeading}>
            <h2 id="experience-heading">Tu experiencia cuenta.</h2>
            <p>Si viajaste con nosotros, compartí tu experiencia en Google.</p>
          </div>
          <div className={styles.review}>
            <a className={styles.submit} href={site.googleReviewsUrl} target="_blank" rel="noopener noreferrer" aria-describedby="google-review-help">
              Dejar una reseña en Google <Arrow />
            </a>
            <p id="google-review-help" className={styles.privacy}>Se abre la ficha de Travel Days en una nueva pestaña. La reseña se escribe y publica en Google.</p>
          </div>
        </section>
      </ContactExplorer>
    </main>
  );
}
