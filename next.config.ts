import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js bundler to treat Prisma as an external Node module.
  // Without this, the bundler tries to statically evaluate @prisma/client
  // during `next build`, causing "Failed to collect page data" crashes.
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
