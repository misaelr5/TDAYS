import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections";
import { MotionProvider } from "@/components/motion";
import "./globals.css";

const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});
const handwriting = localFont({
  src: "./fonts/Caveat.ttf",
  variable: "--font-hand",
  display: "swap",
  weight: "400",
});
export const viewport: Viewport = { themeColor: "#101c29" };
export const metadata: Metadata = {
  title: {
    default: "Travel Days — El mundo te espera",
    template: "%s | Travel Days",
  },
  description:
    "Agencia de viajes en Villa Dolores, Córdoba. Turismo nacional, internacional y receptivo. Tu próximo viaje empieza con una charla.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Travel Days — El mundo te espera",
    description: "Tu próximo viaje empieza con una charla.",
    locale: "es_AR",
    type: "website",
    siteName: "Travel Days",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${handwriting.variable}`}>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <MotionProvider>
          <Header />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
