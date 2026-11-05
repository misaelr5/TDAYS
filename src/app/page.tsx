import {
  Hero,
  ConsultationSection,
} from "@/components/sections";
import { Destinations } from "@/components/destination-cards";
import { GraduatesSection } from "@/features/graduates/graduates-section";
import { ChinaSection } from "@/features/china/china-section";
import { TestimonialsSection } from "@/features/testimonials/testimonials-section";
import { publicOrigin } from "@/config/seo";
import { site } from "@/config/site";

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${publicOrigin}/#website`,
  name: site.name,
  url: publicOrigin,
  inLanguage: "es-AR",
  publisher: { "@id": `${publicOrigin}/#organization` },
};
export default function Home() {
  return (
    <main id="contenido">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website).replace(/</g, "\\u003c") }} />
      <Hero />
      <Destinations />
      <GraduatesSection />
      <TestimonialsSection />
      <ConsultationSection />
      <ChinaSection />
    </main>
  );
}
