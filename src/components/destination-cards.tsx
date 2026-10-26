import Link from "next/link";
import {
  publishedDestinations,
  type Destination,
} from "@/features/destinations/data";
import { whatsappUrl } from "@/config/site";
import { Arrow } from "./icons";
import { Landscape } from "./travel-objects";
import { Carousel } from "./ui/apple-cards-carousel";
import { ApprovedMedia } from "@/features/media/approved-media";
import { DestinationDetails } from "@/features/destinations/destination-details";
import styles from "./destination-cards.module.css";

export function DestinationCard({ destination, details = false }: { destination: Destination; details?: boolean }) {
  const Title = details ? "h2" : "h3";
  return (
    <a
      className={`destination-card ${styles.card}`}
      id={destination.slug}
      data-destination-consultation
      href={whatsappUrl(destination.consultation?.message)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Consultar por ${destination.name} en WhatsApp`}
    >
      <div className={styles.visual}>
        {destination.category && <span className={styles.category}>{destination.category}</span>}
        <ApprovedMedia slot={`destination:${destination.slug}`}><Landscape kind={destination.artwork} /></ApprovedMedia>
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <Title>{destination.name}</Title>
          <span className={styles.cardArrow} aria-hidden="true"><Arrow /></span>
        </div>
        {details && <DestinationDetails destination={destination} />}
        <span className={styles.consultation}>Consultar por WhatsApp <Arrow /></span>
      </div>
    </a>
  );
}

export function Destinations({ full = false }: { full?: boolean }) {
  const Heading = full ? "h1" : "h2";
  const cards = publishedDestinations.map((destination) => (
    <DestinationCard key={destination.slug} destination={destination} details={full} />
  ));
  return (
    <section
      id="destinos"
      className={styles.section}
      data-destinations={full ? "catalog" : "preview"}
      aria-labelledby="destination-heading"
    >
      <div className={styles.heading}>
        <Heading id="destination-heading">
          {full ? "Destinos para tu próxima historia." : "Tu próximo destino."}
        </Heading>
        {full ? <p>Explorá los destinos y conversemos sobre las opciones para tu viaje.</p>
          : <Link className={styles.allDestinations} href="/destinos">
              Ver todos los destinos <Arrow />
            </Link>}
      </div>
      {full && <nav className={styles.catalogGuide} aria-label="Elegí tu tipo de viaje">
        <p><strong>{publishedDestinations.length} destinos.</strong> Una consulta a tu medida.</p>
        <a href="#egresados"><span>¿Viajan con el colegio?</span><strong>Conocé Egresados <Arrow /></strong></a>
      </nav>}
      {full ? (
        <div className={`destination-grid ${styles.grid}`}>{cards}</div>
      ) : (
        <Carousel items={publishedDestinations.map(destination => ({
          slug: destination.slug,
          title: destination.name!,
          category: destination.category,
          href: `/destinos#${destination.slug}`,
          visual: <ApprovedMedia slot={`destination:${destination.slug}`}>
            <Landscape kind={destination.artwork} />
          </ApprovedMedia>,
        }))} />
      )}
    </section>
  );
}
