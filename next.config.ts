import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  outputFileTracingRoot: path.resolve(__dirname),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
