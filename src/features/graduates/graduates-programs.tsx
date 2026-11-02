import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow } from "@/components/icons";
import { ScrollReveal } from "@/features/agency/scroll-reveal";
import type { graduates } from "./data";
import styles from "./graduates-programs.module.css";

type Category = (typeof graduates.levels)[number];
export type GraduatesLevel = Omit<Category, "message" | "mediaSlot" | "caption"> & {
  caption: string;
  href: string;
  visual: ReactNode;
  photographic: boolean;
};

/** Both school levels are visible in the server HTML. No selection or hydration is needed. */
export function GraduatesPrograms({ levels, expanded = false }: { levels: GraduatesLevel[]; expanded?: boolean }) {
  const prefix = expanded ? "escolares" : "inicio-escolares";
  const schools = levels.filter(level => level.id !== "maestros");
  const teachers = levels.find(level => level.id === "maestros");

  return <div className={styles.programs} data-graduates-programs>
    <ScrollReveal root="#egresados" />
    <header className={styles.heading} data-reveal="">
      <div><h2 id="graduates-title">Egresados.</h2></div>
      <p className={styles.introduction}>El viaje es de ustedes.<br />Lo conversamos con el grupo y las familias.</p>
    </header>

    <div className={styles.schools}>
      {schools.map(level => <article key={level.id} id={`${prefix}-${level.id}`} data-level={level.id} data-reveal="" className={styles.school} aria-labelledby={`${prefix}-${level.id}-title`}>
        <header className={styles.schoolHeading}>
          <span>Viaje de egresados</span>
          <h3 id={`${prefix}-${level.id}-title`}>{level.label}<span aria-hidden="true">.</span></h3>
        </header>
        <figure className={styles.photo}>
          {level.visual}
          <figcaption className="sr-only">{level.caption}</figcaption>
        </figure>
        <div className={styles.copy}>
          <p className={styles.storyTitle}>{level.title}</p>
          <p className={styles.description}>{level.description}</p>
          {expanded && <>
            <p className={styles.detail}>{level.detail}</p>
            <div className={styles.conversation}><p>Para empezar, contanos</p><ul>{level.topics.map(topic => <li key={topic}>{topic}</li>)}</ul></div>
          </>}
          <div className={styles.actions}>
            <a className={styles.primary} href={level.href} target="_blank" rel="noreferrer">{level.cta} <Arrow /></a>
            {!expanded && <Link className={styles.more} href={`/destinos?escolar=${level.id}#escolares-${level.id}`}>Conocer la propuesta de {level.id} <Arrow diagonal={false} /></Link>}
          </div>
        </div>
      </article>)}
    </div>

    {!expanded && <Link className={`${styles.more} ${styles.questions}`} href="/destinos#egresados-preguntas">Ver preguntas frecuentes <Arrow diagonal={false} /></Link>}

    {teachers && <article className={styles.teachers} id={`${prefix}-maestros`} data-level="maestros" data-reveal="" aria-labelledby={`${prefix}-maestros-title`}>
      <figure className={styles.teacherPhoto}>{teachers.visual}<figcaption className="sr-only">{teachers.caption}</figcaption></figure>
      <div><p className={styles.teacherLabel}>También viajamos con docentes</p><h3 id={`${prefix}-maestros-title`}>El Maestrazo.</h3><p>{teachers.description}</p></div>
      <div className={styles.teacherActions}>
        <a className={styles.teacherCta} href={teachers.href} target="_blank" rel="noreferrer">{teachers.cta} <Arrow /></a>
        {!expanded && <Link className={styles.more} href="/destinos?escolar=maestros#escolares-maestros">Conocer El Maestrazo <Arrow diagonal={false} /></Link>}
      </div>
    </article>}
  </div>;
}
