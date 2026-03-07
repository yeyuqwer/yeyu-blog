import { z } from 'zod'

const serverEnvSchema = z.object({
  // * 数据库地址
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // * 网站地址
  SITE_URL: z.url().optional(),

  // * 登录
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // * Better Auth
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.url().optional(),

  // * 上传图片
  UPLOADTHING_TOKEN: z.string().optional(),
})

const serverEnvSource = {
  DATABASE_URL: process.env.DATABASE_URL,
  // Fallback to NEXT_PUBLIC_SITE_URL if SITE_URL is not set
  SITE_URL: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
}

export const serverEnv = serverEnvSchema.parse(serverEnvSource)
