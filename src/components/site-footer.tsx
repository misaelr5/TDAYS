import Link from "next/link";
import { Arrow } from "./icons";
import { site, whatsappUrl } from "@/config/site";
import styles from "./site-footer.module.css";

function SocialIcon({ kind }: { kind: "instagram" | "mail" | "chat" }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    {kind === "instagram" ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" /></>
      : kind === "mail" ? <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 6 8 7 8-7" /></>
        : <path d="M21 11.5a9 9 0 0 1-9 9 9.5 9.5 0 0 1-4-.9l-5 1.5 1.5-5a9.5 9.5 0 0 1-.9-4 8.7 8.7 0 1 1 17.4-.6Z" />}
  </svg>;
}

export function SiteFooter() {
  return <footer className={`footer ${styles.footer}`} id="navegacion" tabIndex={-1}>
    <div className={styles.panel}>
      <div className={styles.grid}>
        <div className={styles.column}><h2>Travel Days</h2><Link href="/">Inicio</Link><Link href="/destinos">Destinos</Link><Link href="/destinos#egresados">Egresados</Link><Link href="/nosotros">Nosotros</Link></div>
        <div className={styles.column}><h2>Conversemos</h2><Link href="/contacto">Contacto</Link><a href={whatsappUrl()} target="_blank" rel="noreferrer">WhatsApp</a><a href={`mailto:${site.email}`}>Email</a><a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a></div>
        <div className={styles.column}><h2>Tu viaje</h2><Link href="/contacto#consulta">Organizá tu viaje</Link><Link href="/destinos#egresados-preguntas">Preguntas de egresados</Link><Link href="/contacto#experiencia">Compartí tu experiencia</Link><Link href="/nosotros#historia">Nuestra historia</Link></div>
        <div className={styles.contact}>
          <h2>Sigamos viajando.</h2>
          <p>El próximo viaje empieza con una charla.<br />Contanos tu idea y la pensamos juntos.</p>
          <a className={styles.contactPill} href={whatsappUrl()} target="_blank" rel="noreferrer"><SocialIcon kind="chat" /><span>Escribinos por WhatsApp</span><span className={styles.pillButton}>Hablemos <Arrow /></span></a>
          <div className={styles.socials}>
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram de Travel Days"><SocialIcon kind="instagram" /></a>
            <a href={`mailto:${site.email}`} aria-label="Enviar email a Travel Days"><SocialIcon kind="mail" /></a>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="WhatsApp de Travel Days"><SocialIcon kind="chat" /></a>
          </div>
          <div className={styles.visit}><p>{site.address}</p><p>{site.hours}</p><a href={`tel:${site.phone.replaceAll(" ", "")}`}>{site.phone}</a></div>
        </div>
      </div>
      <div className={styles.bottom}><span>© {new Date().getFullYear()} Travel Days.</span><Link href="/#contenido">Volver al inicio <span aria-hidden="true">↑</span></Link></div>
    </div>
  </footer>;
}
