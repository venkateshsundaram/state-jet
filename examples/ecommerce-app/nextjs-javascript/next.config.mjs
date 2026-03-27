import path from "node:path";
import { fileURLToPath } from "node:url";

const currFilename = fileURLToPath(import.meta.url);
const currDirname = path.dirname(currFilename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // CodeSandbox dev origin
  allowedDevOrigins: ["*.csb.app"],
  turbopack: {
    root: currDirname,
  },
};

export default nextConfig;
