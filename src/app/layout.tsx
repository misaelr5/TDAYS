import type { Metadata, Viewport } from "next";
import { inter, interExtended } from "./fonts/inter";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections";
import { MotionProvider } from "@/components/motion";
import { PageSlide } from "@/components/page-slide";
import { pageMetadata } from "@/config/metadata";
import { publicOrigin, socialImage } from "@/config/seo";
import { site } from "@/config/site";
import { ContactEvents } from "@/features/contact/contact-events";
import { ScrollReveal } from "@/features/agency/scroll-reveal";
import { publishedDestinations } from "@/features/destinations/data";
import "./globals.css";
import "@/features/media/media.css";
import "@/features/destinations/details.css";

export const viewport: Viewport = { themeColor: "#006cf9" };
export const metadata: Metadata = {
  ...pageMetadata("Travel Days | Egresados y turismo en Villa Dolores", "Agencia de viajes en Villa Dolores, Traslasierra, Córdoba. Egresados de primaria y secundaria, turismo joven y viajes nacionales e internacionales. Consultanos.", "/"),
  metadataBase: new URL(publicOrigin),
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  title: {
    default: "Travel Days | Egresados y turismo en Villa Dolores",
    template: "%s | Travel Days",
  },
};
// Published contact data only; legal authorizations, ratings and offers are omitted.
const organization = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": `${publicOrigin}/#organization`,
  name: site.name,
  url: publicOrigin,
  image: socialImage.url,
  logo: `${publicOrigin}/media/logos/travel-days-color.png`,
  description: "Agencia de viajes en Villa Dolores, Traslasierra, Córdoba. Viajes de egresados, educativos, turismo nacional, internacional y receptivo.",
  telephone: site.phone,
  email: site.email,
  address: site.postalAddress,
  openingHours: site.openingHours,
  sameAs: [site.instagram, site.facebook],
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" data-scroll-behavior="smooth" className={`${inter.variable} ${interExtended.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${publicOrigin}/#website`, url: publicOrigin, name: site.name, inLanguage: "es-AR", publisher: { "@id": organization["@id"] } }).replace(/</g, "\\u003c") }} />
        <a className="skip-link" href="#contenido" tabIndex={0}>
          Saltar al contenido
        </a>
        <MotionProvider>
          <ContactEvents destinations={publishedDestinations.map(destination => destination.slug)} />
          <PageSlide />
          <ScrollReveal root="body" selector="[data-soft-reveal]" />
          <Header />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
