import Link from "next/link";
import { Arrow } from "@/components/icons";
import type { GraduatesLevel } from "./graduates-explorer";
import styles from "./graduates-preview.module.css";

/** A short, visual entry point. Detailed guidance remains in the destinations page. */
export function GraduatesPreview({ levels }: { levels: GraduatesLevel[] }) {
  return (
    <section id="egresados" className={`${styles.section} section-pad`} aria-labelledby="graduates-title" data-graduates="preview">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="graduates-title">EGRESADOS</h2>
          <p>Un viaje para recordar juntos.</p>
        </header>

        <div className={styles.levels}>
          {levels.map(level => (
            <a key={level.id} className={styles.card} href={level.href} target="_blank" rel="noreferrer"
              aria-label={`Consultar por ${level.label.toLowerCase()}`} data-level={level.id}>
              <div className={styles.visual} aria-hidden="true">
                {level.visual}
                <span className={styles.caption}>{level.caption.startsWith("Ilustración") ? "Ilustración" : level.caption}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardHeading}>
                  <h3>{level.label}</h3>
                  <span className={styles.arrow} aria-hidden="true"><Arrow /></span>
                </div>
                <p>{level.title}</p>
                <span className={styles.cta}>Consultar por {level.label.toLowerCase()}</span>
              </div>
            </a>
          ))}
        </div>

        <div className={styles.families}>
          <div>
            <h3>Para las familias, las cosas claras.</h3>
            <p>Respuestas antes de dar el primer paso.</p>
          </div>
          <Link href="/destinos#egresados-preguntas">Ver preguntas frecuentes <Arrow /></Link>
        </div>
      </div>
    </section>
  );
}
