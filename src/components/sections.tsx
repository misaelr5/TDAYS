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
  const services = [
    { title: "Turismo nacional e internacional", description: "Contanos qué destino tenés en mente y cómo te gustaría viajar.", message: "Hola Travel Days, quiero consultar por un viaje de turismo nacional o internacional." },
    { title: "Viajes educativos", description: "Una experiencia para el colegio. Empecemos por el grupo y la idea del viaje.", message: "Hola Travel Days, quiero consultar por un viaje educativo para nuestro colegio." },
    { title: "Turismo receptivo", description: "Si estás pensando en visitar la región, conversemos sobre tu viaje.", message: "Hola Travel Days, quiero consultar por turismo receptivo y conocer la región." },
  ];
  return <section className={`${styles.consultation} section-pad`} id="consulta" aria-labelledby="consultation-title" data-travel-consultation>
    <div className={styles.consultationInner}>
      <div>
        <div className={styles.servicesIntro}>
          <h2 id="consultation-title">Más formas de viajar.<br />La misma cercanía.</h2>
          <p>Además de egresados, hay más formas de viajar con nosotros. Elegí tu opción y conversemos por WhatsApp.</p>
        </div>
        <ul className={styles.serviceList}>
          {services.map(service => <li key={service.title}>
            <a href={whatsappUrl(service.message)} target="_blank" rel="noreferrer" aria-label={`Consultar por ${service.title.toLowerCase()} en WhatsApp`}>
              <div><h3>{service.title}</h3><p>{service.description}</p></div>
              <span className={styles.serviceArrow} aria-hidden="true"><Arrow /></span>
            </a>
          </li>)}
        </ul>
      </div>
    </div>
  </section>;
}

export function Footer() {
  return <SiteFooter />;
}
