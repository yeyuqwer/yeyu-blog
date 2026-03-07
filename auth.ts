import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { siwe } from 'better-auth/plugins'
import { generateNonce } from 'siwe'
import { getAddress, verifyMessage as verifyViemMessage } from 'viem'
import { serverEnv } from '@/config/env/server-env'
import { prisma } from '@/prisma/instance'

const env = serverEnv
const siteUrl = env.SITE_URL
const domain = siteUrl !== undefined && siteUrl !== '' ? new URL(siteUrl).host : 'localhost:3000'

const githubAuthConfig =
  env.GITHUB_CLIENT_ID != null && env.GITHUB_CLIENT_SECRET != null
    ? {
        github: {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: githubAuthConfig,
  trustedOrigins: siteUrl != null && siteUrl !== '' ? [siteUrl] : ['http://localhost:3000'],
  plugins: [
    siwe({
      domain,
      getNonce: async () => {
        return generateNonce()
      },
      verifyMessage: async ({ message, signature, address }) => {
        const checksumAddress = getAddress(address)
        return await verifyViemMessage({
          address: checksumAddress,
          message,
          signature: signature as `0x${string}`,
        })
      },
    }),
  ],
})
