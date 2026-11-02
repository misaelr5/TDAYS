import type { MetadataRoute } from "next";
import { publicPaths, publicUrl } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // No invented update dates or entries for the retired /quienes-somos route.
  return publicPaths.map(path => ({ url: publicUrl(path) }));
}
