import { pageMetadata } from "@/config/metadata";
import { Destinations } from "@/components/destination-cards";
import { GraduatesSection } from "@/features/graduates/graduates-section";
export const metadata = pageMetadata("Destinos nacionales, internacionales y egresados", "Explorá los destinos nacionales e internacionales de Travel Days y los viajes de egresados para primaria y secundaria. Consultá desde Villa Dolores, Córdoba.", "/destinos");
export default function DestinationsPage() {
  return (
    <main className="interior-page" id="contenido">
      <Destinations full />
      <GraduatesSection expanded />
    </main>
  );
}
