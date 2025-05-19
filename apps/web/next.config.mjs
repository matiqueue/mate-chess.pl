/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/chess-engine/functions"],
  env: {
    NEXT_PRIVATE_IGNORE_ERRORS_DURING_BUILD: "true",
  },
  output: "standalone",
}
export default nextConfig
