import { z } from 'zod'

const publicEnvSchema = z.object({
  // * 允许访问后台的邮箱
  NEXT_PUBLIC_ADMIN_EMAILS: z.string(),
  // * 允许访问后台的钱包
  NEXT_PUBLIC_ADMIN_WALLET_ADDRESS: z.string().optional(),
  // * 网站地址 (Client side)
  NEXT_PUBLIC_SITE_URL: z.url(),
})

export const validatePublicEnv = () => {
  publicEnvSchema.parse({
    NEXT_PUBLIC_ADMIN_EMAILS: process.env.NEXT_PUBLIC_ADMIN_EMAILS,
    NEXT_PUBLIC_ADMIN_WALLET_ADDRESS: process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  })
}
