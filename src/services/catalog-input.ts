import { deploymentTarget } from "@/config/deployment";
import { pagination } from "@/core/pagination";
export type SearchParameters = Promise<Record<string, string | string[] | undefined>>;
export async function catalogInput(search: SearchParameters) {
  if (deploymentTarget() === "demo") return { limit: 100 };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await search)) {
    for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) params.append(key, item);
  }
  return pagination(params);
}
