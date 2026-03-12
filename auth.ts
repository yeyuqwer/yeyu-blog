import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { siwe } from 'better-auth/plugins'
import { generateNonce } from 'siwe'
import { getAddress, verifyMessage as verifyViemMessage } from 'viem'
import { serverEnv } from '@/config/env/server-env'
import { prisma } from '@/prisma/instance'

const env = serverEnv

const normalizeOrigin = (value?: string) => {
  if (value == null || value.trim() === '') {
    return undefined
  }

  try {
    return new URL(value).origin
  } catch {
    return undefined
  }
}

const trustedOrigins = (() => {
  const origins = new Set<string>()

  const add = (value?: string) => {
    const normalizedOrigin = normalizeOrigin(value)
    if (normalizedOrigin != null) {
      origins.add(normalizedOrigin)
    }
  }

  add(env.SITE_URL)
  add(env.BETTER_AUTH_URL)
  add(process.env.NEXT_PUBLIC_SITE_URL)

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000')
    origins.add('http://127.0.0.1:3000')
  }

  if (origins.size === 0) {
    origins.add('http://localhost:3000')
  }

  return [...origins]
})()

const domain = new URL(trustedOrigins[0]).host

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
  trustedOrigins,
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
