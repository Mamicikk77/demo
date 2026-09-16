import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/qr-menu", destination: "/qr-menu/index.html" },
    ];
  },
};

export default nextConfig;
