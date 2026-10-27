import Link from "next/link";
import { Arrow } from "@/components/icons";
import type { GraduatesLevel } from "./graduates-explorer";
import styles from "./graduates-preview.module.css";

/** One shared story, with native level selection and a specific WhatsApp draft. */
export function GraduatesPreview({ levels }: { levels: GraduatesLevel[] }) {
  return (
    <section id="egresados" className={`${styles.section} section-pad`} aria-labelledby="graduates-title" data-graduates="preview">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Viajes de egresados</p>
            <h2 id="graduates-title">Una etapa termina.<br />El viaje empieza.</h2>
          </div>
          <p>Primaria o secundaria, una historia para compartir. Lo conversamos con el grupo y las familias, desde la primera idea.</p>
        </header>
        <fieldset className={styles.experience}>
          <legend className="sr-only">Elegí el nivel de tu grupo</legend>
          <div className={styles.switcher}>
            <span aria-hidden="true">¿En qué etapa están?</span>
            <div className={styles.choices}>
              {levels.map((level, index) => (
                <label className={styles.choice} key={level.id}>
                  <input type="radio" name="egresados-nivel" value={level.id} defaultChecked={index === 0} aria-controls={`inicio-egresados-${level.id}`} />
                  <span>{level.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className={styles.panels}>
            {levels.map(level => (
              <article key={level.id} className={styles.panel} data-level={level.id} id={`inicio-egresados-${level.id}`} aria-labelledby={`inicio-${level.id}-title`}>
                <figure className={styles.visual}>
                  {level.visual}
                  <figcaption className={styles.caption}>{level.caption.startsWith("Ilustración") ? "Ilustración · un viaje por imaginar" : level.caption}</figcaption>
                </figure>
                <div className={styles.copy}>
                  <p className={styles.eyebrow}>{level.kicker}</p>
                  <h3 id={`inicio-${level.id}-title`}>{level.title}</h3>
                  <p className={styles.description}>{level.description}</p>
                  <div className={styles.conversation}>
                    <p>Para empezar, contanos</p>
                    <ul>{level.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
                  </div>
                  <a className={styles.primary} href={level.href} target="_blank" rel="noreferrer">Consultar por {level.label.toLowerCase()} <Arrow /></a>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.families}>
            <p><strong>Para las familias, las cosas claras.</strong> Qué consultar sobre servicios, organización y condiciones antes de decidir.</p>
            <Link href="/destinos#egresados-preguntas">Ver preguntas frecuentes <Arrow /></Link>
          </div>
        </fieldset>
      </div>
    </section>
  );
}
