/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
  },
}

export default nextConfig
