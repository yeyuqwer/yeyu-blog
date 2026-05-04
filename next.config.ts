import type { NextConfig } from 'next'
import { validatePublicEnv } from './config/env/validate-public-env'

validatePublicEnv()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  reactStrictMode: false,
}

export default nextConfig
