/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.dicebear.com'],
  },
  transpilePackages: ['@fitness-duel/shared'],
}

module.exports = nextConfig
