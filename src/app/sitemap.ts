import type { MetadataRoute } from "next";
import { absoluteUrl, searchIndexable, searchPages } from "@/lib/seo";
import { getLanding } from "@/services/public-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!searchIndexable) return [];
  const { seo } = await getLanding();
  return Object.entries(searchPages)
    .filter(([path, page]) => page.indexable && (path !== "/" || seo.requestedIndexable))
    .map(([path]) => ({ url: absoluteUrl(path) }));
}
