import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
    inlineCss: true,
  },
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
