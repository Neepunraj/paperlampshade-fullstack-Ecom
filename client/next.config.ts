import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vintunacrafts.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dtm7wbzin/image/upload/**",
      },
    ],
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
