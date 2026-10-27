import Link from "next/link";
import { Arrow } from "@/components/icons";
import { GraduatesExplorer, type GraduatesLevel } from "./graduates-explorer";
import styles from "./graduates-preview.module.css";

export function GraduatesPreview({ levels }: { levels: GraduatesLevel[] }) {
  return <section id="egresados" className={`${styles.section} section-pad`} aria-labelledby="graduates-title" data-graduates="preview">
    <div className={styles.inner}>
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}>Viajes escolares</p><h2 id="graduates-title">Del aula al próximo viaje.</h2></div>
        <p>Con compañeros de curso o de profesión. Elegí tu grupo y empecemos a conversar.</p>
      </header>
      <GraduatesExplorer levels={levels} />
      <div className={styles.families}>
        <p><strong>Antes de decidir, las cosas claras.</strong> Qué consultar sobre organización, acompañamiento y condiciones.</p>
        <Link href="/destinos#egresados-preguntas">Ver preguntas frecuentes <Arrow /></Link>
      </div>
    </div>
  </section>;
}
