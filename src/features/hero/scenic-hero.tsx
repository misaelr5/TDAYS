import { publishedDestinations } from "@/features/destinations/data";
import { resolveMedia } from "@/features/media/files";
import { MediaContent } from "@/features/media/approved-media";
import { TripInquiry } from "./trip-inquiry";
import { ScenicLandscape } from "./scenic-landscape";
import { TrustCards } from "./trust-cards";
import styles from "./scenic-hero.module.css";

export function ScenicHero() {
  const media = resolveMedia("hero");
  return <section className={styles.hero} aria-labelledby="hero-title" data-scenic-hero>
    <div className={styles.frame}>
      <div className={styles.background}>{media ? <MediaContent asset={media} sizes="100vw" eager allowVideo /> : <ScenicLandscape />}</div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="hero-title">La única agencia{" "}<br />de egresados de Traslasierra.</h1>
        <p>Seguridad, seriedad, calidad, servicio y cumplimiento.{" "}<br />Así viaja Travel Days®.</p>
        <TripInquiry
          destinations={publishedDestinations.flatMap(destination => destination.name ? [destination.name] : [])}
          catalog={Object.fromEntries(publishedDestinations.flatMap(destination => destination.name ? [[destination.name, destination.slug]] : []))}
        />
      </div>
      <div className={styles.bottom}><span>Desde Villa Dolores, hacia nuevas historias.</span><a href="#destinos">Explorá destinos <span aria-hidden="true">↓</span></a>{!media && <span className={styles.illustration}>Ilustración de paisaje</span>}</div>
    </div>
    <TrustCards />
  </section>;
}
