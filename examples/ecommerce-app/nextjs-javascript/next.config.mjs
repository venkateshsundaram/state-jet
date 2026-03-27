/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // CodeSandbox dev origin
  allowedDevOrigins: ["*.csb.app"],
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
