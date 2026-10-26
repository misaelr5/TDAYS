import { pageMetadata } from "@/config/metadata";
import { AgencyNarrative } from "@/features/agency/narrative";

export const metadata = pageMetadata("Sobre nosotros", "Travel Days es una agencia de Villa Dolores, Córdoba, fundada en 2018 por Javier Garay. Conocé su historia, el equipo, el Legajo 18904 y cómo acompañamos cada viaje.");

export default function AboutPage() {
  return (
    <main id="contenido" className="interior-page">
      <AgencyNarrative />
    </main>
  );
}
