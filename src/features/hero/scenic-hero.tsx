import { publishedDestinations } from "@/features/destinations/data";
import { resolveMedia } from "@/features/media/files";
import { MediaContent } from "@/features/media/approved-media";
import { TripInquiry } from "./trip-inquiry";
import { ScenicLandscape } from "./scenic-landscape";
import { TrustCards } from "./trust-cards";
import { FlightPath, Sticker } from "@/components/stickers";
import styles from "./scenic-hero.module.css";

export function ScenicHero() {
  const media = resolveMedia("hero");
  return <section className={styles.hero} aria-labelledby="hero-title" data-scenic-hero>
    <div className={styles.frame}>
      <div className={styles.background}>{media ? <MediaContent asset={media} sizes="100vw" eager allowVideo /> : <ScenicLandscape />}</div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.content} data-intro-group>
        <p className={styles.lead}>La única agencia de egresados de Traslasierra</p>
        <h1 id="hero-title">
          <span className={styles.word}>
            Egresados
            <FlightPath className={styles.flight} />
            <Sticker kind="star" at={{ top: "-4%", left: "-3%" }} tilt={-14} size="clamp(34px, 4.4vw, 64px)" only="desktop" />
            <Sticker kind="star" at={{ top: "-62%", left: "0" }} tilt={-14} size="34px" only="mobile" />
          </span>{" "}
          <span className={styles.levels}>de <span className={styles.chip} data-tone="orange">primaria</span> y <span className={styles.chip} data-tone="blue">secundaria</span></span>
        </h1>
        <p className={styles.values}>Seguridad, seriedad, calidad, servicio y cumplimiento.{" "}<br />Así viaja Travel Days®.</p>
        <TripInquiry
          destinations={publishedDestinations.flatMap(destination => destination.name ? [destination.name] : [])}
          catalog={Object.fromEntries(publishedDestinations.flatMap(destination => destination.name ? [[destination.name, destination.slug]] : []))}
        />
      </div>
      <div className={styles.bottom} data-intro="4"><span>Desde Villa Dolores, hacia nuevas historias.</span><a href="#egresados">Conocé los viajes de egresados <span aria-hidden="true">↓</span></a>{!media && <span className={styles.illustration}>Ilustración de paisaje</span>}</div>
    </div>
    <TrustCards />
  </section>;
}
