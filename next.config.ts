import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  devIndicators: false,
  compiler: {
    styledComponents: true,
  },
  eslint: {
    dirs: ['app'],
  },
};

export default nextConfig;
