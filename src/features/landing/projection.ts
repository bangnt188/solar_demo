import { unavailable } from "@/core/errors";
import type { LandingDocument, LandingView, MediaRecord, RenderedSection, SiteChrome, LandingSeo } from "@/types/landing";
import type { Equipment, Project } from "@/types/catalog";

export type MediaContext = { basePath: string; r2Origin?: string };
export function resolveMedia(media: MediaRecord, context: MediaContext): string {
  if (media.state !== "READY" || !media.public_use_approved) unavailable();
  if (media.storage_kind === "STATIC" && media.static_path && /^images\/[a-zA-Z0-9_./-]+$/.test(media.static_path) && !media.static_path.includes("..")) return `${context.basePath}/${media.static_path}`;
  if (media.storage_kind === "R2" && media.object_key && /^(landing|projects|equipment)\/[a-f0-9-]{36}\/[a-f0-9-]{36}\.webp$/.test(media.object_key) && context.r2Origin) return `${context.r2Origin}/${media.object_key}`;
  return unavailable();
}

// Only called on a closed-schema document. Field names ending in Slot are the
// declarative image references; every lookup is checked, never a client URL.
function resolveSlots(value: unknown, lookup: (slot: string) => string): unknown {
  if (Array.isArray(value)) return value.map(item => resolveSlots(item, lookup));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => key.endsWith("Slot") && typeof item === "string"
    ? [key.slice(0, -4), lookup(item)] : [key, resolveSlots(item, lookup)]));
}

export function projectLanding(document: LandingDocument, media: MediaRecord[], projects: Project[], equipment: Equipment[], context: MediaContext): LandingView {
  const assets = new Map(media.map(item => [item.id, item]));
  const bindings = new Map(document.mediaBindings.map(item => [item.slot, item.mediaId]));
  const lookup = (slot: string) => {
    const asset = assets.get(bindings.get(slot) || "");
    if (!asset) return unavailable();
    return resolveMedia(asset, context);
  };
  // These assertions describe the Slot -> URL transform of the validated schema.
  // Disabled payloads and internal media state are intentionally not projected.
  const sections = document.sections.filter(section => section.enabled)
    .filter(section => section.key !== "featuredProjects" || projects.length > 0)
    .filter(section => section.key !== "equipmentOffer" || equipment.length > 0)
    .sort((a, b) => a.position - b.position)
    .map(section => ({ key: section.key, position: section.position, content: resolveSlots(section.content, lookup) })) as RenderedSection[];
  return {
    chrome: resolveSlots(document.chrome, lookup) as SiteChrome,
    seo: resolveSlots(document.seo, lookup) as LandingSeo,
    sections, projects, equipment,
  };
}
