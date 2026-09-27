import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { deploymentTarget } from "@/config/deployment";
import { integrationMode } from "@/config/integrations";
import { basePath } from "@/config/site";
import { createMockContent } from "@/repositories/mock-content";
import type { PublicContentRepository } from "@/repositories/public-content";
import type { PageInput } from "@/core/pagination";

let repository: Promise<PublicContentRepository> | undefined;
export function getPublicRepository(): Promise<PublicContentRepository> {
  const mode = integrationMode();
  if (deploymentTarget() === "demo" || mode === "mock") return Promise.resolve(createMockContent(basePath));
  return repository ??= Promise.all([
    import("@/repositories/postgres-content"), import("@/infrastructure/database/client"), import("@/config/server"),
  ]).then(([{ createPostgresContent }, { getDatabase }, { mediaOrigin }]) => createPostgresContent(getDatabase(), { basePath, r2Origin: mediaOrigin() }));
}
async function requestRepository() {
  if (deploymentTarget() === "server") await connection();
  return getPublicRepository();
}
// Request-scoped React cache shares one snapshot across chrome, homepage and metadata.
export const getLanding = cache(async () => (await requestRepository()).landing());
export const getProjectPage = async (input: PageInput = { limit: 20 }) => (await requestRepository()).projects(input);
export const getEquipmentPage = async (input: PageInput = { limit: 20 }) => (await requestRepository()).equipment(input);
