// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ✅ This tells Next.js to ignore ESLint errors during `next build`
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
