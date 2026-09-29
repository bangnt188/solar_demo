const demoUrl = "https://bangnt188.github.io/solar_demo/";
const deploymentUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || demoUrl);

if (deploymentUrl.protocol !== "https:" || deploymentUrl.search || deploymentUrl.hash || deploymentUrl.username || deploymentUrl.password) {
  throw new Error("Invalid deployment URL configuration");
}

export const basePath = deploymentUrl.pathname.replace(/\/+$/, "");
export const siteUrl = `${deploymentUrl.origin}${basePath}/`;
export const isDemoSite = siteUrl === demoUrl;

export const imagePath = (file: string) => `${basePath}/images/demo/${file}`;

// Content adapters resolve DB media to trusted paths/HTTPS URLs. Existing local
// content still uses filenames. This helper never turns arbitrary schemes into src.
export function contentImageSrc(value: string): string {
  if (value.startsWith("https://")) return value;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
  return imagePath(value);
}
