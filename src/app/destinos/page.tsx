import { pageMetadata } from "@/config/metadata";
import { Destinations } from "@/components/destination-cards";
import { GraduatesSection } from "@/features/graduates/graduates-section";
export const metadata = pageMetadata("Destinos", "Explorá los ocho destinos de Travel Days y los viajes escolares para primaria, secundaria y maestros. Conocé El Maestrazo y consultanos por tu grupo.");
export default function DestinationsPage() {
  return (
    <main className="interior-page" id="contenido">
      <Destinations full />
      <GraduatesSection expanded />
    </main>
  );
}
