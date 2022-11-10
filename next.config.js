/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  nextConfig,
  env: {
    NEWS_KEY: process.env.NEWS_KEY,
    AWS_ACCESS_KEY_SECRET: process.env.AWS_ACCESS_KEY_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  },
};
