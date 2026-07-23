import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [{ hostname: '64.23.254.52' }],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
