import type { MetadataRoute } from "next";
import { absoluteUrl, searchIndexable, searchPages } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!searchIndexable) return [];
  return Object.entries(searchPages)
    .filter(([, page]) => page.indexable)
    .map(([path]) => ({ url: absoluteUrl(path) }));
}
