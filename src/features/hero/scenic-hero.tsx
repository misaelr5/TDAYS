import Link from "next/link";
import { publishedDestinations } from "@/features/destinations/data";
import { resolveMedia } from "@/features/media/files";
import { MediaContent } from "@/features/media/approved-media";
import { TripInquiry } from "./trip-inquiry";
import { ScenicLandscape } from "./scenic-landscape";
import styles from "./scenic-hero.module.css";

export function ScenicHero() {
  const media = resolveMedia("hero");
  return <section className={styles.hero} aria-labelledby="hero-title" data-scenic-hero>
    <div className={styles.frame}>
      <div className={styles.background}>{media ? <MediaContent asset={media} sizes="100vw" eager /> : <ScenicLandscape />}</div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="hero-title">Lugares extraordinarios.<br />Historias para toda la vida.</h1>
        <p>Tu próxima gran historia empieza con Travel Days.</p>
        <TripInquiry destinations={publishedDestinations.flatMap(destination => destination.name ? [destination.name] : [])} />
      </div>
      <div className={styles.bottom}><span>Desde Villa Dolores, hacia nuevas historias.</span><a href="#destinos">Explorá destinos <span aria-hidden="true">↓</span></a>{!media && <span className={styles.illustration}>Ilustración de paisaje</span>}</div>
    </div>
    <div className={styles.facts} aria-label="Conocé Travel Days">
      <Link href="/nosotros#historia"><strong>2018</strong><span>El comienzo de Travel Days</span></Link>
      <Link href="/destinos"><strong>{String(publishedDestinations.length).padStart(2, "0")}</strong><span>Destinos por descubrir</span></Link>
      <Link href="/destinos#egresados"><strong>Egresados</strong><span>Primaria y secundaria</span></Link>
      <Link href="/contacto"><strong>Con vos</strong><span>Atención personal</span></Link>
    </div>
  </section>;
}
