const demoUrl = "https://bangnt188.github.io/solar_demo/";
const deploymentUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || demoUrl);

if (deploymentUrl.protocol !== "https:" || deploymentUrl.search || deploymentUrl.hash || deploymentUrl.username || deploymentUrl.password) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute HTTPS URL without query, fragment or credentials.");
}

export const basePath = deploymentUrl.pathname.replace(/\/+$/, "");
export const siteUrl = `${deploymentUrl.origin}${basePath}/`;
export const isDemoSite = siteUrl === demoUrl;

export const imagePath = (file: string) => `${basePath}/images/demo/${file}`;
