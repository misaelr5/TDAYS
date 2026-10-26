import Link from "next/link";
import { Arrow } from "@/components/icons";
import { whatsappUrl } from "@/config/site";
import { credentials, training } from "@/features/agency/data";
import { resolveMedia } from "@/features/media/files";
import { MediaContent } from "@/features/media/approved-media";
import { graduates } from "./data";
import { GraduatesExplorer } from "./graduates-explorer";
import { GraduatesScene } from "./graduates-scene";
import styles from "./graduates.module.css";

export function GraduatesSection({ expanded = false }: { expanded?: boolean }) {
  const media = (expanded && resolveMedia("graduates-detail")) || resolveMedia("graduates");
  const consultation = whatsappUrl(graduates.consultationMessage);
  const levels = graduates.levels.map(level => ({
    ...level,
    href: whatsappUrl(level.message),
    // Approved group media, when it exists, replaces the sunset illustration only.
    visual: level.id === "secundaria" && media ? <MediaContent asset={media} />
      : <GraduatesScene variant={level.id === "primaria" ? "morning" : "sunset"} />,
    caption: level.id === "secundaria" && media ? "Su próxima historia empieza acá." : level.caption,
  }));

  return (
    <section id="egresados" className={`${styles.section} section-pad`} aria-labelledby="graduates-title" data-graduates={expanded ? "expanded" : "preview"}>
      <header className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Viajes de egresados</p>
          <h2 id="graduates-title">Una vez en la vida.</h2>
        </div>
        <p className={styles.introAside}>Termina una etapa y empieza una historia para recordar juntos. Elegí el nivel y contanos cómo imaginan el viaje.</p>
      </header>

      <GraduatesExplorer levels={levels} />

      <div className={styles.method}>
        <aside className={styles.trust} aria-labelledby="graduates-trust">
          <p className={styles.trustFigure}><span>{credentials.experienceYears}</span> años</p>
          <h3 id="graduates-trust">de experiencia de Javier en turismo, que empezó promocionando viajes de egresados en las puertas de los colegios.</h3>
          <ul className={styles.trustFacts}>
            <li>Coordinación con los grupos</li>
            <li>Asistencia paramédica en viaje y destino</li>
            <li>Legajo oficial N.º {credentials.license}</li>
          </ul>
          <Link className={styles.trustLink} href="/nosotros#historia">Conocé nuestra historia <Arrow /></Link>
        </aside>

        <div className={styles.process}>
          <p className={styles.eyebrow}>Cómo empezamos</p>
          <h3>De la primera charla a una propuesta clara.</h3>
          <ol className={styles.steps}>
            {graduates.steps.map((step, index) => (
              <li key={step.title}>
                <span className={styles.stepNumber} aria-hidden="true">0{index + 1}</span>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {expanded && <div className={styles.questions} id="egresados-preguntas">
        <div className={styles.questionsIntro}>
          <p className={styles.eyebrow}>Para estudiantes y familias</p>
          <h3>Las ganas de viajar.<br />Las cosas claras.</h3>
          <p>Escuchar a estudiantes y familias es parte de la historia de Travel Days. Estas son las dudas con las que suele empezar cada grupo.</p>
          <div className={styles.training}>
            <h4>Formación del equipo para trabajar con grupos</h4>
            <ul>{training.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <div className={styles.accordion}>
          {graduates.questions.map((item, index) => <details key={item.question} open={index === 0}>
            <summary><span className={styles.questionNumber} aria-hidden="true">0{index + 1}</span>{item.question}<span className={styles.questionIcon} aria-hidden="true" /></summary>
            <p>{item.answer}</p>
          </details>)}
        </div>
      </div>}

      <div className={styles.closing}>
        <p className={styles.closingTitle}>No te quedes sin tu viaje.</p>
        <p className={styles.closingText}>El primer recuerdo puede empezar con una charla por WhatsApp, con el colegio, el nivel y la idea que tengan.</p>
        <div className={styles.closingActions}>
          <a className={styles.closingPrimary} href={consultation} target="_blank" rel="noreferrer">Hablemos de Egresados <Arrow /></a>
          {expanded ? <a className={styles.closingSecondary} href="#egresados">Volver a los niveles <span aria-hidden="true">↑</span></a>
            : <Link className={styles.closingSecondary} href="/destinos#egresados-preguntas">Preguntas frecuentes <Arrow /></Link>}
        </div>
      </div>
    </section>
  );
}
