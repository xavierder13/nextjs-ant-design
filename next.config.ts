import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "www.google.com" },
      { hostname: "p1-ofp.static.pub" }
    ]
  }
};

export default nextConfig;
