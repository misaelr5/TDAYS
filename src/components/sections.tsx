import Link from "next/link";
import Image from "next/image";
import { whatsappUrl } from "@/config/site";
import { Arrow } from "./icons";
import { ScenicHero } from "@/features/hero/scenic-hero";
import { SiteFooter } from "./site-footer";
import styles from "./sections.module.css";

export function Hero() {
  return <ScenicHero />;
}

export function StorySection({ historyHref = "/nosotros" }: { historyHref?: string }) {
  return <section className={`${styles.story} section-pad`} id="nosotros" aria-labelledby="story-title" data-agency-intro>
    <div className={styles.storyCopy}>
      <span className={styles.tag}>Nuestra forma de viajar</span>
      <h2 id="story-title">La vida sigue.<br />Las ganas de viajar, también.</h2>
      <p>Travel Days nace en Villa Dolores de la mano de Javier Garay. Una agencia para conversar sobre viajes, escuchar lo que buscás y ayudarte a elegir.</p>
      <p>Turismo nacional, internacional y receptivo. Viajes educativos y de egresados. La atención empieza con vos.</p>
      <Link className="text-link" href={historyHref}>Conocé nuestra historia <Arrow /></Link>
    </div>
    <div className={styles.agencyCard}>
      <div className={styles.cardTop}><Image src="/media/logos/travel-days-color.png" alt="Travel Days" width={150} height={61} /><span>Desde 2018</span></div>
      <h3>Desde Villa Dolores.<br />Hacia nuevas historias.</h3>
      <p>Un lugar para conversar sobre lo que buscás en tu próximo viaje.</p>
      <ul><li>Turismo nacional e internacional</li><li>Turismo receptivo</li><li>Viajes educativos y de egresados</li></ul>
    </div>
  </section>;
}

export function ConsultationSection() {
  return <section className={`${styles.consultation} section-pad`} id="consulta" aria-labelledby="consultation-title" data-travel-consultation>
    <div className={styles.consultationPanel}>
      <div className={styles.consultationCopy}>
        <span className={styles.tag}>Tu próxima historia</span>
        <h2 id="consultation-title">Tu próximo viaje.<br />Empieza con una charla.</h2>
        <p>Contanos adónde querés ir, cuándo y con quién. Empecemos por ahí.</p>
        <Link className={styles.lightLink} href="/destinos">Explorá destinos <Arrow /></Link>
      </div>
      <div className={styles.contactCard}>
        <h3>Vos ponés las ganas.</h3>
        <p>Nosotros te escuchamos.</p>
        <dl><div><dt>Destino</dt><dd>El que tengas en mente</dd></div><div><dt>Fecha</dt><dd>La que te gustaría</dd></div><div><dt>Compañía</dt><dd>Con quien quieras compartirlo</dd></div></dl>
        <a href={whatsappUrl()} target="_blank" rel="noreferrer">Hablemos de tu viaje <Arrow /></a>
      </div>
    </div>
  </section>;
}

export function Footer() {
  return <SiteFooter />;
}
