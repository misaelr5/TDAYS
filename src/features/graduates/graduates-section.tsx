import Link from "next/link";
import { Arrow } from "@/components/icons";
import { whatsappUrl } from "@/config/site";
import { credentials, training } from "@/features/agency/data";
import { resolveMedia } from "@/features/media/files";
import { MediaContent } from "@/features/media/approved-media";
import { graduates } from "./data";
import { GraduatesExplorer } from "./graduates-explorer";
import { GraduatesScene } from "./graduates-scene";
import { GraduatesPreview } from "./graduates-preview";
import { GraduatesHelpCenter } from "./graduates-help-center";
import styles from "./graduates.module.css";

export function GraduatesSection({ expanded = false }: { expanded?: boolean }) {
  const media = (expanded && resolveMedia("graduates-detail")) || resolveMedia("graduates");
  const levels = graduates.levels.map(level => ({
    ...level,
    href: whatsappUrl(level.message),
    // Approved group media, when it exists, replaces the sunset illustration only.
    visual: level.id === "secundaria" && media ? <MediaContent asset={media} />
      : <GraduatesScene variant={level.id === "primaria" ? "morning" : "sunset"} framing={expanded ? "portrait" : "landscape"} />,
    caption: level.id === "secundaria" && media ? "Su próxima historia empieza acá." : level.caption,
  }));

  if (!expanded) return <GraduatesPreview levels={levels} />;

  return (
    <section id="egresados" className={`${styles.section} section-pad`} aria-labelledby="graduates-title" data-graduates="expanded">
      <header className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Viajes de egresados</p>
          <h2 id="graduates-title">Una vez en la vida.</h2>
        </div>
        <p className={styles.introAside}>Termina una etapa y empieza una historia para recordar juntos. Elegí el nivel y contanos cómo imaginan el viaje.</p>
      </header>

      <GraduatesExplorer levels={levels} />

      <section className={styles.guide} aria-labelledby="graduates-guide-title" data-graduates-guide>
        <header className={styles.guideHeading}>
          <p className={styles.eyebrow}>Para estudiantes y familias</p>
          <h3 id="graduates-guide-title">Organizamos el viaje con ustedes.</h3>
          <p>Lo que necesitan saber para empezar, conversar en grupo y decidir con información.</p>
        </header>

        <GraduatesHelpCenter topics={[
          {
            id: "egresados-inicio", label: "Cómo empezar",
            content: <ol className={styles.steps}>
              {graduates.steps.map((step, index) => (
                <li key={step.title}>
                  <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
                  <div><h5>{step.title}</h5><p>{step.description}</p></div>
                </li>
              ))}
            </ol>,
          },
          ...graduates.questions.map(item => ({
            id: item.id,
            label: item.topic,
            content: <div className={styles.accordion}>
              <details open>
                <summary><span>{item.question}</span><span className={styles.questionIcon} aria-hidden="true" /></summary>
                <div className={styles.answer}><p>{item.answer}</p></div>
              </details>
            </div>,
          })),
          {
            id: "egresados-acompanamiento", label: "Acompañamiento",
            content: <div className={styles.accordion}>
              <details open>
                <summary><span>¿Cómo se prepara el equipo para acompañarnos?</span><span className={styles.questionIcon} aria-hidden="true" /></summary>
                <div className={styles.answer}>
                  <p>Consultá por la coordinación del grupo y la asistencia paramédica en viaje y destino. El equipo informa formación en:</p>
                  <ul className={styles.training}>{training.map(item => <li key={item}>{item}</li>)}</ul>
                  <p>Los servicios y su alcance se confirman en la propuesta de cada grupo.</p>
                </div>
              </details>
            </div>,
          },
        ]} />

        <aside className={styles.backing} aria-label="La experiencia y la oficina de Travel Days">
          <ul className={styles.facts}>
            <li><strong>{credentials.experienceYears} años</strong> de experiencia de Javier Garay</li>
            <li>Oficina en Villa Dolores</li>
            <li>Legajo N.º {credentials.license}</li>
          </ul>
          <Link className={styles.historyLink} href="/nosotros#historia">Conocé nuestra historia <Arrow /></Link>
        </aside>

        <div className={styles.guideContact}>
          <div><p className={styles.contactTitle}>Hablemos del viaje del grupo.</p><p>Colegio, nivel y la idea que tengan. Podemos empezar por ahí.</p></div>
          <div className={styles.guideActions}>
            {levels.map(level => <a key={level.id} className={styles.guideCta} data-guide-level={level.id} href={level.href} target="_blank" rel="noreferrer">Consultar por nuestro grupo <Arrow /></a>)}
            <a className={styles.backLink} href="#egresados">Volver a los niveles <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </section>
    </section>
  );
}
