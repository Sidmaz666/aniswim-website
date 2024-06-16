/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false,
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gogocdn.net',
      },
      {
        protocol: 'https',
        hostname: "subsplease.org",
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
}

module.exports = nextConfig
