import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack to avoid runtime issues
  experimental: {
    turbo: false,
  },
  // Image optimization configuration
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'cloudinary.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      }
    ]
  },
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fix for potential module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };

    return config;
  },
};

export default nextConfig;
