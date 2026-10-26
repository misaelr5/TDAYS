import Link from "next/link";
import { ViewTransition } from "react";
import {
  destinationTransitionName,
  publishedDestinations,
  type Destination,
} from "@/features/destinations/data";
import { whatsappUrl } from "@/config/site";
import { Arrow } from "./icons";
import { Landscape } from "./travel-objects";
import { Carousel } from "./ui/apple-cards-carousel";
import { ExpandGroup } from "./expand-group";
import { ApprovedMedia } from "@/features/media/approved-media";
import { DestinationDetails } from "@/features/destinations/destination-details";
import { approvedMedia } from "@/config/media";
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
        <ViewTransition name={destinationTransitionName(destination.slug)} share="destination-morph" default="none">
          <ApprovedMedia slot={`destination:${destination.slug}`} sizes="(max-width: 639px) 100vw, (max-width: 1100px) 45vw, 25vw"><Landscape kind={destination.artwork} /></ApprovedMedia>
        </ViewTransition>
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
        <ExpandGroup
          className={`destination-grid ${styles.grid}`}
          label="Catálogo de destinos"
          items={publishedDestinations.map(destination => ({ key: destination.slug, content: <DestinationCard destination={destination} details /> }))}
        />
      ) : (
        <Carousel items={publishedDestinations.map(destination => ({
          slug: destination.slug,
          title: destination.name!,
          category: destination.category,
          location: destination.location,
          href: `/destinos#${destination.slug}`,
          // Height-driven: landscape photos cover tall cards, so width alone underestimates.
          visual: <ApprovedMedia slot={`destination:${destination.slug}`} sizes="(max-width: 767px) 150vw, (max-width: 1199px) 90vw, 70vw">
            <Landscape kind={destination.artwork} />
          </ApprovedMedia>,
        }))} />
      )}
      <PhotoCredits />
    </section>
  );
}

function PhotoCredits() {
  const credits = publishedDestinations.flatMap(destination => {
    const credit = approvedMedia(`destination:${destination.slug}`)?.credit;
    return credit ? [{ name: destination.name!, ...credit }] : [];
  });
  if (!credits.length) return null;
  return <details className={styles.credits}>
    <summary>Créditos de las fotografías</summary>
    <ul>{credits.map(credit => <li key={credit.name}>
      {credit.name}: <a href={credit.source} target="_blank" rel="noreferrer">{credit.author}</a>, <a href={credit.licenseUrl} target="_blank" rel="noreferrer license">{credit.license}</a>
    </li>)}</ul>
    <p>Fotografías de Wikimedia Commons, recortadas para esta sección.</p>
  </details>;
}
