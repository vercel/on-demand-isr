import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**'
      }
    ]
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  }
};

export default nextConfig;
