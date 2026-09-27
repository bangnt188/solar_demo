import { publicRouter } from "@/core/public-router";
import { getPublicRepository } from "@/services/public-content";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const dispatch = publicRouter(getPublicRepository);
export async function GET(request: Request, context: { params: Promise<{ resource: string }> }) {
  return dispatch((await context.params).resource, request);
}
