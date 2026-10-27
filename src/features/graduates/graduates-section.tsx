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
  const levels = graduates.levels.map(({ message, mediaSlot, ...level }) => {
    // Resolve each category separately: a photo's approval never assigns it to
    // another audience. Only public presentation data crosses the client boundary.
    const media = (expanded && level.id === "primaria" && resolveMedia("school:primaria-detail")) || resolveMedia(mediaSlot);
    return {
      ...level,
      href: whatsappUrl(message),
      caption: media ? (level.id === "maestros" ? level.caption : "Viajes escolares · archivo de Travel Days")
        : (level.id === "maestros" ? "Ilustración · una salida por conversar" : level.caption),
      photographic: media !== null,
      visual: media ? <MediaContent asset={media} sizes="(max-width: 767px) 90vw, (max-width: 1300px) 50vw, 680px" />
        : <GraduatesScene variant={level.id === "primaria" ? "morning" : "sunset"} framing="landscape" />,
    };
  });

  if (!expanded) return <GraduatesPreview levels={levels} />;

  return (
    <section id="egresados" className={`${styles.section} section-pad`} aria-labelledby="graduates-title" data-graduates="expanded">
      <header className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Viajes escolares</p>
          <h2 id="graduates-title">Estudiantes, familias y docentes.</h2>
        </div>
        <p className={styles.introAside}>Primaria, secundaria o El Maestrazo. Cada grupo tiene sus preguntas; empecemos por las de ustedes.</p>
      </header>

      <GraduatesExplorer levels={levels} expanded />

      <section className={styles.guide} aria-labelledby="graduates-guide-title" data-graduates-guide>
        <header className={styles.guideHeading}>
          <p className={styles.eyebrow}>Antes de viajar</p>
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
          <div><p className={styles.contactTitle}>Hablemos del viaje del grupo.</p><p>Estudiantes o docentes: contanos quiénes son y qué les gustaría organizar.</p></div>
          <div className={styles.guideActions}>
            <a className={styles.guideCta} data-guide-general href={whatsappUrl(graduates.consultationMessage)} target="_blank" rel="noreferrer">Consultar por nuestro grupo <Arrow /></a>
            {levels.map(level => <a key={level.id} className={styles.guideCta} data-guide-level={level.id} href={level.href} target="_blank" rel="noreferrer">Consultar por nuestro grupo <Arrow /></a>)}
            <a className={styles.backLink} href="#egresados">Volver a las categorías <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </section>
    </section>
  );
}
