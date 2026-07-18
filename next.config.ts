import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.7'],
  serverExternalPackages: ['sanity', '@sanity/icons'],
};

export default nextConfig;
