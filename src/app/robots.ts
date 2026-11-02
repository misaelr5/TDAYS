import type { MetadataRoute } from "next";
import { indexingEnabled, publicUrl } from "@/config/seo";
export default function robots(): MetadataRoute.Robots {
  return indexingEnabled
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: publicUrl("/sitemap.xml") }
    : { rules: { userAgent: "*", disallow: "/" } };
}
