import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, //Keep Strict Mode on during dev if you want to catch side-effect bugs early.
  images: {
    remotePatterns: [
      { hostname: "www.google.com" },
      { hostname: "p1-ofp.static.pub" }
    ]
  }
};

export default nextConfig;
