/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  nextConfig,
  env: {
    NEWS_KEY: process.env.NEWS_KEY,
    ACCESS_KEY_SECRET_AWS: process.env.ACCESS_KEY_SECRET_AWS,
    ACCESS_KEY_ID_AWS: process.env.ACCESS_KEY_ID_AWS,
  },
};
