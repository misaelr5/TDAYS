import { pageMetadata } from "@/config/metadata";
import { Destinations } from "@/components/destination-cards";
export const metadata = pageMetadata("Destinos", "Explorá los destinos de Travel Days y consultanos por fechas, alojamiento y opciones para tu viaje.");
export default function DestinationsPage() {
  return (
    <main className="interior-page" id="contenido">
      <Destinations full />
    </main>
  );
}
