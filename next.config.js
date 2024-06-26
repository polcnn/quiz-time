/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
    assetPrefix: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BASEURL : undefined,
};

module.exports = nextConfig;
