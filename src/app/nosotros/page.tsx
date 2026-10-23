import type { Metadata } from "next";
import { StorySection, LocationSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Conocé Travel Days, la agencia de Javier Garay que nació en 2018 en Villa Dolores, Córdoba.",
};

export default function AboutPage() {
  return (
    <main id="contenido" className="interior-page">
      <div className="interior-title">
        <h1>Sobre nosotros</h1>
      </div>
      <StorySection />
      <LocationSection />
    </main>
  );
}
