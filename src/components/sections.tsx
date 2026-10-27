import Link from "next/link";
import Image from "next/image";
import { site, whatsappUrl } from "@/config/site";
import { credentials } from "@/features/agency/data";
import { resolveMedia } from "@/features/media/files";
import { MediaContent } from "@/features/media/approved-media";
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
  const office = resolveMedia("page:inicio");
  const services = [
    { title: "Turismo nacional e internacional", description: "Contanos qué destino tenés en mente y cómo te gustaría viajar.", message: "Hola Travel Days, quiero consultar por un viaje de turismo nacional o internacional." },
    { title: "Viajes educativos", description: "Una experiencia para el colegio. Empecemos por el grupo y la idea del viaje.", message: "Hola Travel Days, quiero consultar por un viaje educativo para nuestro colegio." },
    { title: "Turismo receptivo", description: "Si estás pensando en visitar la región, conversemos sobre tu viaje.", message: "Hola Travel Days, quiero consultar por turismo receptivo y conocer la región." },
  ];
  return <section className={`${styles.consultation} section-pad`} id="consulta" aria-labelledby="consultation-title" data-travel-consultation>
    <div className={styles.consultationInner}>
      <div className={styles.services}>
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
      <div className={styles.agency}>
        {office && <figure className={styles.office}>
          <MediaContent asset={office} sizes="(max-width: 767px) 100vw, 45vw" />
          <figcaption>Nuestra oficina en Villa Dolores</figcaption>
        </figure>}
        <div className={styles.agencyCopy}>
          <h3>Un viaje empieza<br />con alguien que te escucha.</h3>
          <p>Javier Garay fundó Travel Days en {credentials.founded}, con una trayectoria personal de más de {credentials.experienceYears} años en turismo. Hoy seguimos atendiendo de cerca, antes, durante y después de cada viaje.</p>
          <Link className={styles.historyLink} href="/nosotros#historia">Conocé nuestra historia <Arrow /></Link>
          <div className={styles.officeContact}>
            <p>Hablemos por WhatsApp o en la oficina.</p>
            <address>{site.address}</address>
            <a className={styles.contactAction} href={whatsappUrl()} target="_blank" rel="noreferrer">Hablemos de tu viaje <Arrow /></a>
            <Link className={styles.officeLink} href="/contacto#oficina">Ver ubicación y horarios <Arrow /></Link>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

export function Footer() {
  return <SiteFooter />;
}
