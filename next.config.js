/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false,
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gogocdn.net',
      },
    ],
  },
}

module.exports = nextConfig
