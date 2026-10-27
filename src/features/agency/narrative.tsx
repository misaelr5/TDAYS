import type { CSSProperties } from "react";
import { Arrow, Plane } from "@/components/icons";
import { site, whatsappUrl } from "@/config/site";
import { ScenicLandscape } from "@/features/hero/scenic-landscape";
import { resolveMedia } from "@/features/media/files";
import { MediaContent } from "@/features/media/approved-media";
import { agencyValues, credentials, teamMembers, timeline, training } from "./data";
import { TeamMemberCard } from "./team-member";
import { ScrollReveal } from "./scroll-reveal";
import { OfficeMap } from "./office-map";
import { Chapters } from "./chapters";
import styles from "./narrative.module.css";

const journey = [
  { stage: "Antes", text: "Te explicamos qué incluye cada propuesta: transporte, alojamiento, comidas, excursiones y condiciones." },
  { stage: "Durante", text: "Coordinadores acompañan a los grupos y una paramédica viaja con ellos. Ante un imprevisto, buscamos la respuesta con vos." },
  { stage: "Después", text: "La oficina sigue en el mismo lugar, con las mismas personas, para pensar el próximo viaje." },
];

// Short labels for the flight stops; the full texts stay in data.ts.
const stops = ["Vende viajes de egresados en las puertas de los colegios.", "Ventas, coordinación, operación, supervisión y gerencia.", "Nace la agencia propia en Villa Dolores.", "Un equipo de nueve personas y una oficina abierta."];

const profileClasses = { profile: styles.profile, monogram: styles.monogram, portrait: styles.portrait, body: styles.profileBody };
const order = (index: number) => ({ "--i": index }) as CSSProperties;

// Authorized public narrative adapted from the original /quienes-somos page.
export function AgencyNarrative() {
  const office = resolveMedia("page:nosotros");
  const storyPhoto = resolveMedia("page:nosotros-historia");
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;
  return <div className={styles.narrative} data-agency-narrative>
    <ScrollReveal root="[data-agency-narrative]" />

    <section className={styles.hero} aria-labelledby="about-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Nosotros · Villa Dolores, Córdoba</p>
        <h1 id="about-title">Detrás de cada viaje hay personas que podés conocer.</h1>
        <p className={styles.heroLead}>Somos una agencia de Traslasierra. Desde {credentials.founded} organizamos viajes nacionales, internacionales, receptivos, educativos y de egresados, con una oficina abierta donde te atiende el equipo.</p>
        <div className={styles.heroActions}>
          <a className={styles.primary} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp <Arrow /></a>
          <a className="text-link" href="#historia">Conocé la historia <Arrow /></a>
        </div>
      </div>
      <figure className={styles.heroVisual}>
        {office ? <MediaContent asset={office} sizes="(max-width: 767px) 92vw, 40vw" eager /> : <ScenicLandscape />}
        <figcaption className={styles.office}>
          <span>Nuestra oficina</span>
          <strong>{site.address}</strong>
        </figcaption>
      </figure>
    </section>

    <Chapters label="Conocé la agencia" chapters={[
      { id: "historia", label: "Nuestra historia", content: <>
        <section className={styles.story} aria-labelledby="history-heading">
          <div className={styles.storyIntro} data-reveal="">
            <h2 id="history-heading">De la puerta de los colegios a una agencia propia.</h2>
            <p className={styles.lead}>A los 17 años, Javier Garay empezó a promocionar viajes de egresados en las puertas de los colegios. Pasó por ventas, coordinación, operación y gerencia: hoy suma 23 años de experiencia personal en turismo.</p>
            <p>En 2018 fundó la agencia en Villa Dolores. Hoy la sostiene un equipo de nueve personas.</p>
            <blockquote className={styles.quote}>
              <p>Que el pasajero pueda sentarse frente al dueño, plantear sus dudas y recibir la misma atención antes y durante el viaje.</p>
              <footer>La idea con la que Javier Garay fundó Travel Days</footer>
            </blockquote>
          </div>
          <figure className={styles.storyPhoto} data-reveal="" data-photo-slot={storyPhoto ? undefined : "page:nosotros-historia"}>
            {storyPhoto ? <MediaContent asset={storyPhoto} sizes="(max-width: 899px) 92vw, 34vw" /> : <span className={styles.photoFrame} aria-hidden="true"><Plane /></span>}
          </figure>
          <div className={styles.flight} data-reveal="">
            <svg className={styles.route} viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
              <path className={styles.routeLine} d="M10 92C180 92 230 28 380 40S600 104 760 72 930 20 990 30" pathLength="1" />
            </svg>
            <span className={styles.plane} aria-hidden="true"><Plane /></span>
            <ol aria-label="Trayectoria de Javier y de la agencia">
              {timeline.map((item, index) => <li key={item.marker} style={order(index)} title={item.description}>
                <span className={styles.marker}>{item.marker}</span>
                <h3>{item.title}</h3>
                <p>{stops[index]}</p>
              </li>)}
            </ol>
          </div>
        </section>

        <section className={styles.backing} aria-labelledby="backing-heading">
          <div className={styles.backingPanel} data-reveal="">
            <div className={styles.backingHead}>
              <h2 id="backing-heading">El respaldo detrás de la atención.</h2>
              <p>Una agencia habilitada, con calidad certificada.</p>
            </div>
            <dl className={styles.facts}>
              <div style={order(0)}><dt>Experiencia de Javier en turismo</dt><dd><span data-count={credentials.experienceYears}>{credentials.experienceYears}</span> años</dd></div>
              <div style={order(1)}><dt>Fundación de Travel Days</dt><dd>{credentials.founded}</dd></div>
              <div style={order(2)}><dt>Legajo oficial N.º</dt><dd>{credentials.license}</dd></div>
              <div style={order(3)}><dt>Certificación</dt><dd className={styles.factText}>{credentials.quality}</dd></div>
            </dl>
            <div className={styles.values}>
              <h3>Cómo trabajamos</h3>
              <dl>
                {agencyValues.map((value, index) => <div key={value.title} data-agency-value style={order(index)}><dt>{value.title}</dt><dd className="sr-only">{value.description}</dd></div>)}
              </dl>
            </div>
          </div>
        </section>
      </> },
      { id: "equipo", label: "El equipo", content: <>
        <section className={styles.team} aria-labelledby="team-heading">
          <div className={styles.sectionHead} data-reveal="">
            <h2 id="team-heading">Quiénes te van a atender.</h2>
            <p>Nueve personas, una misma oficina. Las conocés cuando venís.</p>
          </div>
          <div className={styles.teamGrid} data-reveal="">
            {teamMembers.map((member, index) => <TeamMemberCard key={member.id} member={member} index={index} classes={profileClasses} />)}
          </div>
        </section>
      </> },
      { id: "compromiso", label: "Cómo te acompañamos", content: <>
        <section className={styles.commitment} aria-labelledby="commitment-heading">
          <div className={styles.sectionHead} data-reveal="">
            <h2 id="commitment-heading">Cómo te acompañamos.</h2>
            <p>Lo que hacemos en cada etapa, sin letra chica.</p>
          </div>
          <ol className={styles.journey} data-reveal="">
            {journey.map((step, index) => <li key={step.stage} style={order(index)}>
              <span className={styles.step} aria-hidden="true">0{index + 1}</span>
              <h3>{step.stage}</h3>
              <p>{step.text}</p>
            </li>)}
          </ol>
          <aside className={styles.training} aria-labelledby="training-heading" data-reveal="">
            <h3 id="training-heading">Formación del equipo para trabajar con grupos</h3>
            <ul>{training.map((item, index) => <li key={item} style={order(index)}>{item}</li>)}</ul>
            <p className={styles.attribution}>Áreas de formación informadas por la agencia. No se presentan como certificaciones verificadas.</p>
          </aside>
        </section>
      </> },
      { id: "visitanos", label: "Visitanos", content: <>
        <section className={styles.closing} aria-labelledby="agency-consultation">
          <div className={styles.closingPanel} data-reveal="">
            <div className={styles.closingCopy}>
              <h2 id="agency-consultation">Pasá por la oficina o escribinos.</h2>
              <p className={styles.closingLead}>Contanos qué viaje tenés en mente. Te responde alguien del equipo, con nombre y apellido.</p>
              <dl className={styles.contactList}>
                <div><dt>Horarios</dt><dd>{site.hours}</dd></div>
                <div><dt>WhatsApp</dt><dd>{site.phone}</dd></div>
              </dl>
              <div className={styles.heroActions}>
                <a className={styles.light} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp <Arrow /></a>
              </div>
            </div>
            <OfficeMap address={site.address} directions={directions} />
          </div>
        </section>
      </> },
    ]} />
  </div>;
}
