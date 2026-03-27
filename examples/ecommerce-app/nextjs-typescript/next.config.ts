import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // CodeSandbox dev origin
  allowedDevOrigins: ["*.csb.app"],
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
