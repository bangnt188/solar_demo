import type { HomeContent } from "./home-content";
import type { Equipment, Project } from "./catalog";

export type SiteLink = {
  label: string;
  href: string;
  children?: SiteLink[];
  overviewLabel?: string;
};

export type SiteChrome = {
  announcement: { enabled: boolean; lead: string; body: string; actionLabel: string; actionHref: string };
  brand: { label: string; lines: string[]; href: string; logo: string };
  navigation: { label: string; items: SiteLink[]; callToAction: SiteLink };
  conversion: { surveyHref: string; phoneHref: string | null; zaloHref: string | null };
  footer: { columns: { title: string; items: { label: string; href?: string }[] }[]; note: string };
};

export type LandingSeo = { title: string; description: string; requestedIndexable: boolean; ogImage?: string };
export type SectionKey = keyof HomeContent;
// Published database membership comes from featuredProjects IDs; the local demo
// keeps its title selection without adding a second selection to stored content.
export type RenderedContent = Omit<HomeContent, "featuredProjects"> & {
  featuredProjects: Omit<HomeContent["featuredProjects"], "projectTitles"> & { projectTitles?: readonly string[] };
};
export type RenderedSection = { [K in SectionKey]: { key: K; position: number; content: RenderedContent[K] } }[SectionKey];

type SlotImage<T> = Omit<T, "image"> & { imageSlot: string };
type StoredContent = Omit<HomeContent, "hero" | "services" | "solutions" | "whyUs" | "faq" | "featuredProjects"> & {
  hero: Omit<HomeContent["hero"], "image" | "bottomImage"> & { imageSlot: string; bottomImageSlot: string };
  services: Omit<HomeContent["services"], "items"> & { items: (SlotImage<HomeContent["services"]["items"][number]> & { key: string })[] };
  solutions: Omit<HomeContent["solutions"], "items"> & { items: (SlotImage<HomeContent["solutions"]["items"][number]> & { key: string })[] };
  whyUs: Omit<HomeContent["whyUs"], "images"> & { images: (SlotImage<HomeContent["whyUs"]["images"][number]> & { key: string })[] };
  faq: SlotImage<HomeContent["faq"]>;
  featuredProjects: Omit<HomeContent["featuredProjects"], "projectTitles">;
};
export type StoredSection = { [K in SectionKey]: { key: K; position: number; enabled: boolean; content: StoredContent[K] } }[SectionKey];
export type LandingDocument = {
  schemaVersion: 1;
  chrome: Omit<SiteChrome, "brand"> & { brand: Omit<SiteChrome["brand"], "logo"> & { logoSlot: string } };
  seo: Omit<LandingSeo, "ogImage"> & { ogImageSlot?: string };
  sections: StoredSection[];
  mediaBindings: { slot: string; mediaId: string }[];
  featuredProjects: { projectId: string; position: number }[];
  featuredEquipment: { equipmentId: string; position: number }[];
};
export type LandingView = {
  chrome: SiteChrome;
  seo: LandingSeo;
  sections: RenderedSection[];
  projects: readonly Project[];
  equipment: readonly Equipment[];
};
export type MediaRecord = {
  id: string;
  storage_kind: "STATIC" | "R2";
  static_path: string | null;
  object_key: string | null;
  state: "PENDING" | "READY" | "DELETE_PENDING";
  public_use_approved: boolean;
};
