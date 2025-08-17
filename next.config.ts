import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // For localhost (development)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', 
        pathname: '/**', 
      },
      // For Pexels (production)
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '', 
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;
