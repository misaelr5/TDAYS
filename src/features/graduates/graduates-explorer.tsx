import type { ReactNode } from "react";
import { Arrow } from "@/components/icons";
import styles from "./graduates.module.css";

export type GraduatesLevel = {
  id: string;
  label: string;
  kicker: string;
  title: string;
  description: string;
  topics: readonly string[];
  caption: string;
  href: string;
  visual: ReactNode;
};

/** Native radio choices work with click, touch, arrow keys and without JS.
 * Both stories are server-rendered; CSS reveals the selected one in place.
 */
export function GraduatesExplorer({ levels }: { levels: GraduatesLevel[] }) {
  return <div className={styles.explorer} data-graduates-explorer>
    <fieldset className={styles.levelSelector}>
      <legend>Elegí el nivel de tu grupo</legend>
      <div className={styles.levelChoices}>
        {levels.map((level, index) => <label key={level.id} className={styles.levelOption}>
          <input className={styles.levelChoice} type="radio" name="egresados-nivel" value={level.id} defaultChecked={index === 0} aria-controls={`egresados-${level.id}-panel`} />
          <span>{level.label}</span><Arrow />
        </label>)}
      </div>
    </fieldset>
    <div className={styles.levelPanels}>
      {levels.map(level => <article key={level.id} className={styles.panel} data-level={level.id} id={`egresados-${level.id}-panel`} aria-labelledby={`egresados-${level.id}`}>
        <div className={styles.panelContent} data-panel-content>
          <p className={styles.panelKicker}>{level.kicker}</p>
          <h3 id={`egresados-${level.id}`} className={styles.panelTitle}>{level.title}</h3>
          <p className={styles.panelText}>{level.description}</p>
          <div className={styles.conversation}>
            <p className={styles.topicsLabel}>Para la primera charla</p>
            <ul className={styles.topics}>{level.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
          </div>
          <a className={styles.panelCta} href={level.href} target="_blank" rel="noreferrer">Consultar por {level.label.toLowerCase()} <Arrow /></a>
        </div>
        <figure className={styles.panelMedia}>{level.visual}<figcaption className={styles.panelCaption}>{level.caption}</figcaption></figure>
      </article>)}
    </div>
  </div>;
}
