/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // Turbopack configuration (Next.js 16+)
  turbopack: {},
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig