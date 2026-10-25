import Link from "next/link";
import { Arrow } from "@/components/icons";
import { RevealText } from "@/components/motion";
import { site, whatsappUrl } from "@/config/site";
import { agencyValues, teamAreas, teamMembers, timeline } from "./data";
import { TeamMemberCard } from "./team-member";
import styles from "./narrative.module.css";

// Authorized public narrative adapted from the original /quienes-somos page.
export function AgencyNarrative() {
  return <div className={styles.narrative} data-agency-narrative>
    <section id="historia" className={styles.paper} aria-labelledby="history-heading">
      <div className={styles.split}>
        <div className={styles.heading}>
          <h2 id="history-heading"><RevealText>De los colegios a una agencia propia.</RevealText></h2>
          <p className={styles.signature}>Javier Garay</p>
          <p className={styles.caption}>Fundador de Travel Days</p>
        </div>
        <div className={styles.copy}>
          <p className={styles.lead}>A los 17 años, Javier Garay empezó a promocionar viajes de egresados en las puertas de los colegios. Ahí comenzó un recorrido que lo llevó a conocer el turismo desde distintas áreas.</p>
          <p>Primero llegaron las reuniones con estudiantes; después, las charlas con las familias y la firma de contratos. Con el tiempo asumió tareas de ventas, supervisión y gerencia, además de coordinación y operación de viajes.</p>
          <p>Se especializó en turismo estudiantil, viajes educativos y grupos nacionales e internacionales. Javier cuenta con 23 años de experiencia personal en turismo, según su relato.</p>
          <p>En 2018 fundó la agencia en Villa Dolores. Quería un lugar donde el pasajero pudiera ser atendido por el propio dueño, conversar sobre sus dudas y encontrar una atención cercana durante la contratación y el viaje.</p>
        </div>
      </div>
      <ol className={styles.timeline} aria-label="Trayectoria de Javier y de la agencia">
        {timeline.map(item => <li key={item.marker}>
          <span className={styles.marker}>{item.marker}</span>
          <div><h3>{item.title}</h3><p>{item.description}</p></div>
        </li>)}
      </ol>
    </section>
    <section className={styles.dark} aria-labelledby="values-heading">
      <div className={styles.split}>
        <div className={styles.heading}>
          <h2 id="values-heading"><RevealText>Cómo trabajamos con tus consultas.</RevealText></h2>
          <p>Javier pone el diálogo, la honestidad y el cumplimiento en el centro de la agencia. Estos son los criterios que orientan su trabajo.</p>
        </div>
        <div className={styles.values}>
          {agencyValues.map(value => <article key={value.title} data-agency-value><h3>{value.title}</h3><p>{value.description}</p></article>)}
        </div>
      </div>
    </section>
    <section className={styles.paper} aria-labelledby="training-heading">
      <div className={styles.split}>
        <div className={styles.heading}>
          <h2 id="training-heading"><RevealText>Formación para trabajar con grupos.</RevealText></h2>
          <p>Javier informa que el equipo se capacita en primeros auxilios, convivencia y manejo de grupos.</p>
        </div>
        <div className={styles.topics}>
          <article><h3>Primeros auxilios</h3><p>Primeros auxilios, RCP y manejo de DEA, según lo informado por Javier.</p></article>
          <article><h3>Convivencia y cuidado</h3><p>Perspectiva de género, prevención del grooming y del bullying.</p></article>
          <article><h3>Grupos e imprevistos</h3><p>Manejo de grupos y emergencias como parte de la preparación del equipo.</p></article>
          <p className={styles.attribution}>Las áreas de formación corresponden a lo informado por la agencia. No se presentan como certificaciones verificadas.</p>
        </div>
      </div>
      <div className={`${styles.split} ${styles.team}`}>
        <div className={styles.heading}><h2 id="team-heading">Las áreas de Travel Days.</h2><p>Asesoramiento, administración, operación y coordinación son las áreas que intervienen en la atención y la organización de los viajes.</p></div>
        <div className={styles.topics} aria-labelledby="team-heading">
          {teamAreas.map(area => <article key={area.title} data-team-area><h3>{area.title}</h3><p>{area.description}</p></article>)}
          {teamMembers.map(member => <TeamMemberCard key={member.id} member={member} />)}
        </div>
      </div>
    </section>
    <section className={styles.closing} aria-labelledby="agency-consultation">
      <div className={styles.heading}><h2 id="agency-consultation">Encontranos en Villa Dolores.</h2><p className={styles.signature}>Empecemos por una charla.</p></div>
      <div className={styles.copy}>
        <p>Acercate a la oficina para conversar sobre opciones, servicios y condiciones antes de contratar. Podés plantear tus dudas y hablar con el dueño de la agencia.</p>
        <p>{site.address}</p>
        <div className={styles.actions}>
          <a className="text-link" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp <Arrow /></a>
          <Link className="text-link" href="/contacto">Ver dirección y horarios <Arrow /></Link>
        </div>
      </div>
    </section>
  </div>;
}
