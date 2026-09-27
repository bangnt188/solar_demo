import { deploymentTarget } from "./deployment";

const demoUrl = "https://bangnt188.github.io/solar_demo/";
const target = deploymentTarget();
if (target === "server" && !process.env.NEXT_PUBLIC_SITE_URL) throw new Error("Server target requires NEXT_PUBLIC_SITE_URL");
const deploymentUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || demoUrl);

if (deploymentUrl.protocol !== "https:" || deploymentUrl.search || deploymentUrl.hash || deploymentUrl.username || deploymentUrl.password) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute HTTPS URL without query, fragment or credentials.");
}

export const basePath = deploymentUrl.pathname.replace(/\/+$/, "");
export const siteUrl = `${deploymentUrl.origin}${basePath}/`;
export const isDemoSite = siteUrl === demoUrl;
if (target === "server" && (basePath || isDemoSite)) throw new Error("Server target requires a root site origin without the demo prefix");

export const imagePath = (file: string) => `${basePath}/images/demo/${file}`;

// Content adapters resolve DB media to trusted paths/HTTPS URLs. Existing local
// content still uses filenames. This helper never turns arbitrary schemes into src.
export function contentImageSrc(value: string): string {
  if (value.startsWith("https://")) return value;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
  return imagePath(value);
}
