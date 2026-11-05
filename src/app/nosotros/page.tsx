import { pageMetadata } from "@/config/metadata";
import { AgencyNarrative } from "@/features/agency/narrative";

export const metadata = pageMetadata("Agencia de viajes en Villa Dolores, Córdoba", "Conocé Travel Days: agencia de viajes de Traslasierra fundada en 2018 por Javier Garay. Historia, equipo y oficina en Felipe Erdman 222, Villa Dolores.", "/nosotros");

export default function AboutPage() {
  return (
    <main id="contenido" className="interior-page">
      <AgencyNarrative />
    </main>
  );
}
