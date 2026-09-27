import { basePath } from "./src/config/site";
import type { NextConfig } from "next";
import { deploymentTarget } from "./src/config/deployment";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

export default function nextConfig(phase: string): NextConfig { return {
  ...(deploymentTarget() === "demo" && phase === PHASE_PRODUCTION_BUILD ? { output: "export" as const } : {}),
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: { unoptimized: true },
}; }
