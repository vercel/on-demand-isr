/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
