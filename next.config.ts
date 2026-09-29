import { basePath } from "./src/config/site";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@solar/ui"],
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
