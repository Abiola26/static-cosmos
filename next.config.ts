import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5085',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
