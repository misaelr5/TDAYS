import Link from "next/link";
import { pageMetadata } from "@/config/metadata";
import { site, whatsappUrl } from "@/config/site";
import { Arrow } from "@/components/icons";
import { termsSections, termsUpdated } from "@/features/legal/terms";
import { TermsIndex } from "@/features/legal/terms-index";
import styles from "@/features/legal/terms.module.css";

export const metadata = pageMetadata("Términos y condiciones", "Condiciones de uso del sitio de Travel Days, consultas, reservas, cancelaciones y tratamiento de datos personales.");

export default function TermsPage() {
  return (
    <main id="contenido" className={`interior-page ${styles.page}`}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Legal</p>
        <h1>Términos y condiciones</h1>
        <p>Lo que necesitás saber antes de consultar o viajar con nosotros, escrito en simple.</p>
        <p className={styles.updated}>Última actualización: <time dateTime={termsUpdated.iso}>{termsUpdated.label}</time></p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.aside}>
          <TermsIndex sections={termsSections.map(({ id, title }) => ({ id, title }))} />
        </aside>

        <article className={styles.article}>
          {termsSections.map((section, index) => <section key={section.id} id={section.id} className={styles.section} aria-labelledby={`${section.id}-title`}>
            <h2 id={`${section.id}-title`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{section.title}</h2>
            {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
          </section>)}

          <section className={styles.contact} aria-labelledby="terms-contact-title">
            <h2 id="terms-contact-title">¿Te quedó alguna duda?</h2>
            <p>Escribinos y lo conversamos. Estamos en {site.address}.</p>
            <div className={styles.contactLinks}>
              <a className={styles.primary} href={whatsappUrl("Hola Travel Days, tengo una consulta sobre los términos y condiciones.")} target="_blank" rel="noreferrer">Escribinos por WhatsApp <Arrow /></a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.facebook} target="_blank" rel="noreferrer">Facebook</a>
              <Link href="/contacto">Ir a contacto</Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
