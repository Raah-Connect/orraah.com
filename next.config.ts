import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [{ hostname: 'updates.orraah.com' }],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;