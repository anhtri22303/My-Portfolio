import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  allowedDevOrigins: ["http://192.168.1.6:3000", "http://localhost:3000"],
};

export default nextConfig;
