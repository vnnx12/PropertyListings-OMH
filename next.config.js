/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picture.omh.app',
          port: '',
          pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'api.omh.app',
            port: '',
            pathname: '/**',
          },
      ],
    },
  }
