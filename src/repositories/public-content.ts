import type { Page, PageInput } from "@/core/pagination";
import type { Equipment, Project } from "@/types/catalog";
import type { LandingView } from "@/types/landing";

/** Implemented by the local demo and PostgreSQL. Public data only, never drafts. */
export interface PublicContentRepository {
  landing(): Promise<LandingView>;
  projects(input: PageInput): Promise<Page<Project>>;
  equipment(input: PageInput): Promise<Page<Equipment>>;
}
