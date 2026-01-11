/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Bagrut_website',
  assetPrefix: '/Bagrut_website',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig

