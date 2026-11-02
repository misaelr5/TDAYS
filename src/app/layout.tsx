import type { Metadata, Viewport } from "next";
import { inter, interExtended } from "./fonts/inter";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections";
import { MotionProvider } from "@/components/motion";
import { PageSlide } from "@/components/page-slide";
import { pageMetadata } from "@/config/metadata";
import { publicOrigin } from "@/config/seo";
import { site } from "@/config/site";
import { ContactEvents } from "@/features/contact/contact-events";
import { publishedDestinations } from "@/features/destinations/data";
import "./globals.css";
import "@/features/media/media.css";
import "@/features/destinations/details.css";

export const viewport: Viewport = { themeColor: "#006cf9" };
export const metadata: Metadata = {
  ...pageMetadata("Travel Days — Egresados de primaria y secundaria", "Viajes de egresados de primaria y secundaria con Travel Days, en Villa Dolores, Córdoba. Consultá por tu grupo y conocé nuestras propuestas de turismo.", "/"),
  metadataBase: new URL(publicOrigin),
  title: {
    default: "Travel Days — Egresados de primaria y secundaria",
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
    <html lang="es-AR" className={`${inter.variable} ${interExtended.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
        <a className="skip-link" href="#contenido" tabIndex={0}>
          Saltar al contenido
        </a>
        <MotionProvider>
          <ContactEvents destinations={publishedDestinations.map(destination => destination.slug)} />
          <PageSlide />
          <Header />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
