import type { Metadata } from "next";
export function pageMetadata(title: string, description: string): Metadata {
  const brandedTitle = `${title} | Travel Days`;
  return {
    title, description,
    openGraph: { title: brandedTitle, description, locale: "es_AR", type: "website", siteName: "Travel Days" },
    twitter: { card: "summary", title: brandedTitle, description },
  };
}
