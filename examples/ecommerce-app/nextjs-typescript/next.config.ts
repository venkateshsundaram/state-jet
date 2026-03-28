import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __DIRNAME = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /* config options here */
  // CodeSandbox dev origin
  allowedDevOrigins: ["*.csb.app"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      tailwindcss: path.resolve(__DIRNAME, "node_modules/tailwindcss"),
    };
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__DIRNAME, "node_modules"),
    ];
    return config;
  },
  // Keep the old key for backward/forward compatibility if needed
  turbopack: {
    resolveAlias: {
      tailwindcss: path.resolve(__DIRNAME, "node_modules/tailwindcss"),
    },
  },
};

export default nextConfig;
