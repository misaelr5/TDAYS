import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main id="contenido" className={`${styles.page} not-found-page`}>
      <div className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="Travel Days, inicio">
          <Image
            src="/media/logos/1.png"
            alt="Travel Days"
            width={126}
            height={44}
            priority
          />
        </Link>
        <span className={styles.status}>Error de ruta <span>404</span></span>
      </div>

      <section className={styles.content} aria-labelledby="not-found-title">
        <div className={styles.map} aria-hidden="true">
          <svg className={styles.routes} viewBox="0 0 640 560" fill="none">
            <path
              className={styles.contour}
              d="M88 34c85 57 129 12 209 48s66 93 165 108 87 50 115 97M43 173c74-27 116 26 162 61s58 54 135 47 104 47 214 37M90 502c24-73 97-83 107-153s54-71 93-94 70-91 120-99 71-45 121-87"
            />
            <path
              className={styles.route}
              d="M67 393c92-6 85-112 193-94s69 101 170 75 78-129 153-123"
            />
            <circle className={styles.routeDot} cx="67" cy="393" r="7" />
            <circle className={styles.destination} cx="583" cy="251" r="9" />
            <circle className={styles.destinationHalo} cx="583" cy="251" r="21" />
            <path className={styles.crosshair} d="M583 220v-19m0 100v-19m31-31h19m-100 0h19" />
          </svg>
          <span className={styles.number}>404</span>
          <span className={styles.mapNote}>desvío inesperado</span>
        </div>

        <div className={styles.message}>
          <p className={styles.handwritten}>Parece que tomamos otro camino</p>
          <h1 id="not-found-title">Este destino<br />no está en el mapa.</h1>
          <p className={styles.description}>
            La dirección que buscás no existe o cambió de ruta. Volvamos al inicio
            y seguimos desde ahí.
          </p>
          <Link className={styles.homeLink} href="/">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
              <path d="m3 9 7-6 7 6v7a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1V9Z" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </section>

      <div className={styles.bottomline} aria-hidden="true">
        <span>Travel Days</span>
        <span>Villa Dolores, Córdoba</span>
      </div>
    </main>
  );
}
