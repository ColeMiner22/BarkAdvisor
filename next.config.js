/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AMAZON_AFFILIATE_TAG: process.env.AMAZON_AFFILIATE_TAG
  },
  poweredByHeader: false,
  generateEtags: false,
  distDir: '.next',
  cleanDistDir: true,
  webpack: (config, { isServer }) => {
    // Add custom webpack config for module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src'
    };
    return config;
  }
}

module.exports = nextConfig 