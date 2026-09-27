import { AppError } from "./errors";
import { route } from "./http";
import { pagination } from "./pagination";
import type { PublicContentRepository } from "@/repositories/public-content";

export function publicRouter(repository: () => Promise<PublicContentRepository>) {
  const endpoints = {
    landing: route({ policy: { kind: "public-read" }, parse: (request: Request) => {
      if (new URL(request.url).search) throw new AppError("INVALID_INPUT", "Landing không nhận revision hoặc query parameters.");
    }, execute: async () => (await repository()).landing() }),
    projects: route({ policy: { kind: "public-read" }, parse: (request: Request) => pagination(new URL(request.url).searchParams), execute: async input => (await repository()).projects(input) }),
    equipment: route({ policy: { kind: "public-read" }, parse: (request: Request) => pagination(new URL(request.url).searchParams), execute: async input => (await repository()).equipment(input) }),
  };
  return (resource: string, request: Request) => {
    if (!Object.hasOwn(endpoints, resource)) return route({ policy: { kind: "public-read" }, parse: () => undefined, execute: () => { throw new AppError("NOT_FOUND", "Không tìm thấy tài nguyên."); } })(request);
    return endpoints[resource as keyof typeof endpoints](request);
  };
}
