import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // CodeSandbox dev origin
  allowedDevOrigins: ["*.csb.app"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "tailwindcss": path.resolve(process.cwd(), "node_modules/tailwindcss"),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "tailwindcss": path.resolve(process.cwd(), "node_modules/tailwindcss"),
    },
  },
};

export default nextConfig;
