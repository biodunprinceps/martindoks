import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use webpack instead of Turbopack to avoid TurbopackInternalError
  // Add empty turbopack config to silence the warning
  turbopack: {},
  // Asset prefix for cPanel - leave empty for relative paths
  assetPrefix: "",
  // Base path configuration
  basePath: "",
  images: {
    // DISABLE image optimization for cPanel compatibility
    // This will serve images directly without Node.js processing
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Enable compression
  compress: true,
  // Output configuration removed for Netlify compatibility
};

export default nextConfig;
