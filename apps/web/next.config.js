/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.dicebear.com'],
  },
  transpilePackages: ['@fitness-duel/shared'],
  output: 'standalone',
  // Disable static optimization to avoid build errors
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip static generation for error pages
  experimental: {
    workerThreads: false,
    cpus: 1
  }
}

module.exports = nextConfig
