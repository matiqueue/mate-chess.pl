/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/chess-engine/functions"],
  reactStrictMode: false,
}

export default nextConfig
