import type { MetadataRoute } from "next";
import { absoluteUrl, searchIndexable } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // Crawlers must be able to read noindex. This is not access control.
    rules: { userAgent: "*", allow: "/" },
    ...(searchIndexable ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
  };
}
