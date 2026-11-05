import type { Metadata } from "next";

/** Confirmed production origin. Preview builds still canonicalize to production. */
export const publicOrigin = "https://traveldays.tur.ar";
export const publicPaths = ["/", "/destinos", "/nosotros", "/contacto", "/terminos"] as const;
export type PublicPath = typeof publicPaths[number];

// Deliberately opt-in and evaluated at build time for prerendered metadata/routes.
// Vercel's environment takes precedence: a preview cannot opt itself into indexing.
// Other hosts must explicitly identify the production build with SITE_ENV.
const deploymentEnvironment = process.env.VERCEL_ENV ?? (process.env.VERCEL === "1" ? undefined : process.env.SITE_ENV);
export const indexingEnabled = process.env.SITE_INDEXING === "true" && deploymentEnvironment === "production";
export const indexingRobots: Metadata["robots"] = {
  index: indexingEnabled,
  follow: indexingEnabled,
  ...(indexingEnabled ? { googleBot: { index: true, follow: true, "max-image-preview": "large" as const, "max-snippet": -1, "max-video-preview": -1 } } : {}),
};
export const publicUrl = (path: string) => `${publicOrigin}${path === "/" ? "" : path}`;
export const socialImage = {
  url: publicUrl("/opengraph-image.jpg"),
  width: 1200,
  height: 630,
  alt: "Travel Days · Tu próximo viaje empieza con una charla. Oficina en Villa Dolores.",
};
