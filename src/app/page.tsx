import {
  Hero,
  ConsultationSection,
} from "@/components/sections";
import { Destinations } from "@/components/destination-cards";
import { GraduatesSection } from "@/features/graduates/graduates-section";
import { ChinaSection } from "@/features/china/china-section";
export default function Home() {
  return (
    <main id="contenido">
      <Hero />
      <Destinations />
      <GraduatesSection />
      <ConsultationSection />
      <ChinaSection />
    </main>
  );
}
