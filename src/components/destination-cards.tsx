import Link from "next/link";
import {
  publishedDestinations,
  type Destination,
} from "@/features/destinations/data";
import { whatsappUrl } from "@/config/site";
import { Arrow } from "./icons";
import { Postcard } from "./travel-objects";
import { RevealText } from "./motion";
import { approvedPhotos } from "@/config/media";
import { DestinationCarousel } from "./destination-carousel";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <a
      className="destination-card"
      href={whatsappUrl(destination.consultation?.message)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Consultar por ${destination.name} en WhatsApp`}
    >
      <div className="destination-visual">
        <span className="card-category">{destination.category}</span>
        <Postcard
          name={destination.name ?? ""}
          kind={destination.artwork}
          photo={approvedPhotos[`destination:${destination.slug}`]}
        />
        <span className="card-arrow">
          <Arrow />
        </span>
      </div>
      <div className="destination-meta">
        <h3>{destination.name}</h3>
        <span>
          Consultar <Arrow />
        </span>
      </div>
    </a>
  );
}

export function Destinations({ full = false }: { full?: boolean }) {
  const Heading = full ? "h1" : "h2";
  const cards = publishedDestinations.map((destination) => (
    <DestinationCard key={destination.slug} destination={destination} />
  ));
  return (
    <section
      id="destinos"
      className={`destinations light-section section-pad ${full ? "catalog-full" : ""}`}
      aria-labelledby="destination-heading"
    >
      <span className="section-index">/ DESTINOS POR DESCUBRIR</span>
      <div className="section-heading-row">
        <Heading id="destination-heading">
          <RevealText>PRÓXIMAS GRANDES HISTORIAS.</RevealText>
        </Heading>
        <div className="heading-aside">
          <p>
            Un lugar nuevo.
            <br />
            Otra forma de mirar.
            <br />
            Tu próximo viaje empieza acá.
          </p>
          {!full && (
            <Link className="text-link" href="/destinos">
              Ver todos los destinos <Arrow />
            </Link>
          )}
        </div>
      </div>
      <span className="ghost-script" aria-hidden="true">
        allá vamos
      </span>
      {full ? (
        <div className="destination-grid">{cards}</div>
      ) : (
        <DestinationCarousel itemCount={publishedDestinations.length}>
          {cards}
        </DestinationCarousel>
      )}
    </section>
  );
}
