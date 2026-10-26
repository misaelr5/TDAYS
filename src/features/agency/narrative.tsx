import Link from "next/link";
import { Arrow } from "@/components/icons";
import { RevealText } from "@/components/motion";
import { site, whatsappUrl } from "@/config/site";
import { ScenicLandscape } from "@/features/hero/scenic-landscape";
import { resolveMedia } from "@/features/media/files";
import { MediaContent } from "@/features/media/approved-media";
import { agencyValues, credentials, owner, teamAreas, teamMembers, timeline, training } from "./data";
import { TeamMemberCard } from "./team-member";
import styles from "./narrative.module.css";

const reasons = [
  {
    title: "Te atiende una persona",
    text: "Tenemos oficina en Villa Dolores. Podés venir, sentarte a conversar y hablar con el dueño de la agencia.",
    detail: site.address,
  },
  {
    title: "Conocemos el oficio",
    text: "Javier trabaja en turismo desde los 17 años: vendió, coordinó, supervisó y gerenció viajes antes de fundar la agencia.",
    detail: `${credentials.experienceYears} años de experiencia de Javier`,
  },
  {
    title: "Respondemos durante todo el viaje",
    text: "Coordinación con los grupos, asistencia paramédica en viaje y destino, y un equipo formado para actuar ante imprevistos.",
    detail: "Cómo te acompañamos",
    href: "#compromiso",
  },
];

const journey = [
  { stage: "Antes", text: "Te explicamos qué incluye cada propuesta: transporte, alojamiento, comidas, excursiones y condiciones. Preguntá todo lo que necesites antes de decidir." },
  { stage: "Durante", text: "Coordinadores acompañan a los grupos y contamos con una paramédica para el viaje y el destino. Si surge un imprevisto, buscamos la respuesta con vos." },
  { stage: "Después", text: "La oficina sigue en el mismo lugar. Volvés a encontrar a las mismas personas para contarnos cómo salió y pensar el próximo viaje." },
];

const profileClasses = { profile: styles.profile, monogram: styles.monogram, portrait: styles.portrait, featured: styles.featured };

// Authorized public narrative adapted from the original /quienes-somos page.
export function AgencyNarrative() {
  const office = resolveMedia("page:nosotros");
  return <div className={styles.narrative} data-agency-narrative>
    <section className={styles.hero} aria-labelledby="about-title">
      <div className={styles.heroCopy}>
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

    <nav className={styles.chapterNav} aria-label="Conocé la agencia">
      <span>Travel Days, de cerca.</span>
      <a href="#historia">Nuestra historia <Arrow /></a>
      <a href="#equipo">El equipo <Arrow /></a>
      <a href="#compromiso">Cómo te acompañamos <Arrow /></a>
    </nav>

    <section id="historia" className={styles.story} aria-labelledby="history-heading">
      <div className={styles.storyAside}>
        <p className={styles.bigFigure} aria-hidden="true">17</p>
        <p className={styles.figureCaption}>años tenía Javier Garay cuando empezó en el turismo.</p>
      </div>
      <div className={styles.storyBody}>
        <h2 id="history-heading"><RevealText>De la puerta de los colegios a una agencia propia.</RevealText></h2>
        <p className={styles.lead}>A los 17 años, Javier Garay empezó a promocionar viajes de egresados en las puertas de los colegios. Primero fueron las reuniones con estudiantes; después, las charlas con las familias y la firma de contratos.</p>
        <p>Con el tiempo pasó por ventas, coordinación, operación, supervisión y gerencia. Se especializó en turismo estudiantil, viajes educativos y grupos nacionales e internacionales. Hoy suma 23 años de experiencia personal en turismo.</p>
        <p>En 2018 fundó la agencia en Villa Dolores, con una idea simple: que el pasajero pueda sentarse frente al dueño, plantear sus dudas y recibir la misma atención cercana antes y durante el viaje.</p>
      </div>
      <ol className={styles.timeline} aria-label="Trayectoria de Javier y de la agencia">
        {timeline.map(item => <li key={item.marker}>
          <span className={styles.marker}>{item.marker}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </li>)}
      </ol>
    </section>

    <section className={styles.reasons} aria-labelledby="reasons-heading">
      <div className={styles.sectionHead}>
        <h2 id="reasons-heading">Por qué elegirnos.</h2>
        <p>Tres cosas que vas a notar desde la primera consulta.</p>
      </div>
      <div className={styles.reasonList}>
        {reasons.map(reason => <article key={reason.title} className={styles.reason}>
          <h3>{reason.title}</h3>
          <p>{reason.text}</p>
          {reason.href ? <a className={styles.detail} href={reason.href}>{reason.detail} <Arrow /></a> : <p className={styles.detail}>{reason.detail}</p>}
        </article>)}
      </div>
      <div className={styles.values}>
        <h3>Los criterios con los que trabajamos</h3>
        <dl>
          {agencyValues.map(value => <div key={value.title} data-agency-value><dt>{value.title}</dt><dd>{value.description}</dd></div>)}
        </dl>
      </div>
    </section>

    <section className={styles.backing} aria-labelledby="backing-heading">
      <div className={styles.backingPanel}>
        <div className={styles.backingHead}>
          <h2 id="backing-heading">El respaldo detrás de la atención.</h2>
          <p>Una agencia habilitada, con calidad certificada y la experiencia de quien la dirige.</p>
        </div>
        <dl className={styles.facts}>
          <div className={styles.factMain}><dt>Experiencia de Javier en turismo</dt><dd>{credentials.experienceYears} años</dd></div>
          <div><dt>Fundación de Travel Days</dt><dd>{credentials.founded}</dd></div>
          <div><dt>Legajo oficial N.º</dt><dd>{credentials.license}</dd></div>
          <div><dt>Certificación</dt><dd className={styles.factText}>{credentials.quality}</dd></div>
        </dl>
        <p className={styles.services}>Turismo nacional, internacional, estudiantil y receptivo.</p>
      </div>
    </section>

    <section id="equipo" className={styles.team} aria-labelledby="team-heading">
      <div className={styles.sectionHead}>
        <h2 id="team-heading">Quiénes te van a atender.</h2>
        <p>Ocho personas, cuatro áreas y una misma oficina.</p>
      </div>
      <div className={styles.teamGrid}>
        <div className={styles.ownerTile}><TeamMemberCard member={owner} featured classes={profileClasses} /></div>
        {teamAreas.map(area => <section key={area.id} className={styles.area} aria-labelledby={`area-${area.id}`} data-team-area>
          <h3 id={`area-${area.id}`} className={styles.areaTitle}>{area.title}</h3>
          <p className={styles.areaText}>{area.description}</p>
          <div className={styles.members}>
            {teamMembers.filter(member => member.area === area.id).map(member => <TeamMemberCard key={member.id} member={member} classes={profileClasses} />)}
          </div>
        </section>)}
      </div>
    </section>

    <section id="compromiso" className={styles.commitment} aria-labelledby="commitment-heading">
      <div className={styles.sectionHead}>
        <h2 id="commitment-heading">Cómo te acompañamos.</h2>
        <p>Lo que hacemos en cada etapa, sin letra chica.</p>
      </div>
      <ol className={styles.journey}>
        {journey.map(step => <li key={step.stage}><h3>{step.stage}</h3><p>{step.text}</p></li>)}
      </ol>
      <aside className={styles.training} aria-labelledby="training-heading">
        <h3 id="training-heading">Formación del equipo para trabajar con grupos</h3>
        <ul>{training.map(item => <li key={item}>{item}</li>)}</ul>
        <p className={styles.attribution}>Áreas de formación informadas por la agencia. No se presentan como certificaciones verificadas.</p>
      </aside>
    </section>

    <section className={styles.closing} aria-labelledby="agency-consultation">
      <div className={styles.closingPanel}>
        <h2 id="agency-consultation">Pasá por la oficina o escribinos.</h2>
        <p className={styles.closingLead}>Contanos qué viaje tenés en mente. Te responde alguien del equipo, con nombre y apellido.</p>
        <dl className={styles.contactList}>
          <div><dt>Oficina</dt><dd>{site.address}</dd></div>
          <div><dt>Horarios</dt><dd>{site.hours}</dd></div>
          <div><dt>WhatsApp</dt><dd>{site.phone}</dd></div>
        </dl>
        <div className={styles.heroActions}>
          <a className={styles.primary} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp <Arrow /></a>
          <Link className={styles.ghost} href="/contacto">Ver contacto y ubicación <Arrow /></Link>
        </div>
      </div>
    </section>
  </div>;
}
