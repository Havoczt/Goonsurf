import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow og:image thumbnails from anywhere
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
