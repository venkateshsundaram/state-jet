import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currFilename = fileURLToPath(import.meta.url);
const currDirname = path.dirname(currFilename);

const nextConfig: NextConfig = {
  /* config options here */
  // CodeSandbox dev origin
  allowedDevOrigins: ["*.csb.app"],
  turbopack: {
    root: currDirname,
  },
};

export default nextConfig;
