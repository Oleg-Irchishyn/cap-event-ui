import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  compiler: {
    styledComponents: true,
  },
  eslint: {
    dirs: ['app']
  },
};

export default nextConfig;
