/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone", // Enable standalone output for Docker
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    serverComponentsExternalPackages: ['puppeteer'], // Externalize puppeteer to avoid bundling issues on Vercel
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize puppeteer for server-side builds
      config.externals = config.externals || []
      config.externals.push('puppeteer')
    }
    return config
  },
}

module.exports = nextConfig

