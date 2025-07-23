import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
  images: {
    remotePatterns: [{ hostname: "img.clerk.com" }],
  },
};

export default nextConfig;
