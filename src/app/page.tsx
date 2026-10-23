import {
  Hero,
  LocationSection,
  StorySection,
  ConsultationSection,
} from "@/components/sections";
import { Destinations } from "@/components/destination-cards";
export default function Home() {
  return (
    <main id="contenido">
      <Hero />
      <Destinations />
      <LocationSection />
      <StorySection />
      <ConsultationSection />
    </main>
  );
}
