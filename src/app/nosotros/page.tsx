import { pageMetadata } from "@/config/metadata";
import { StorySection, LocationSection } from "@/components/sections";
import { AgencyNarrative } from "@/features/agency/narrative";

export const metadata = pageMetadata("Sobre nosotros", "Conocé a Javier Garay, su trayectoria personal en turismo y la historia de Travel Days, fundada en 2018 en Villa Dolores, Córdoba.");

export default function AboutPage() {
  return (
    <main id="contenido" className="interior-page">
      <div className="interior-title">
        <h1>Sobre nosotros</h1>
      </div>
      <StorySection historyHref="#historia" />
      <AgencyNarrative />
      <LocationSection />
    </main>
  );
}
