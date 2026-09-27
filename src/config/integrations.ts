import { AppError } from "@/core/errors";

type Environment = Readonly<Record<string, string | undefined>>;
/** Mock is an explicit product mode, never a fallback after a provider failure. */
export function integrationMode(env: Environment = process.env): "mock" | "cloud" {
  const mode = env.INTEGRATION_MODE || "mock";
  if (mode !== "mock" && mode !== "cloud") throw new AppError("UNAVAILABLE", "INTEGRATION_MODE must be mock or cloud");
  if ((env.APP_ENV === "production" || env.VERCEL_ENV === "production") && mode !== "cloud") {
    throw new AppError("UNAVAILABLE", "Production cannot use mock integrations");
  }
  return mode;
}
export function requireCloudMode(env: Environment = process.env): void {
  if (integrationMode(env) !== "cloud") throw new AppError("UNAVAILABLE", "Cloud operation disabled in mock mode");
}
