import type { Metadata } from "next";
import { indexingRobots, publicUrl, socialImage, type PublicPath } from "./seo";
export function pageMetadata(title: string, description: string, path: PublicPath): Metadata {
  const brandedTitle = path === "/" ? title : `${title} | Travel Days`;
  return {
    title, description,
    alternates: { canonical: publicUrl(path) },
    robots: indexingRobots,
    openGraph: { title: brandedTitle, description, url: publicUrl(path), locale: "es_AR", type: "website", siteName: "Travel Days", images: [socialImage] },
    twitter: { card: "summary_large_image", title: brandedTitle, description, images: [socialImage] },
  };
}
