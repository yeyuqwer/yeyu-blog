import { z } from 'zod'

const optionalEnvString = z.preprocess(
  value => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().optional(),
)

const optionalEnvBooleanString = z.preprocess(
  value => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.enum(['true', 'false']).optional(),
)

const serverEnvSchema = z.object({
  // * 数据库地址
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // * 网站地址
  SITE_URL: z.url().min(1, 'SITE_URL is required'),

  // * 登录
  GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required'),
  GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),

  // * Better Auth
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
  BETTER_AUTH_URL: z.url(),

  // * 上传图片
  UPLOADTHING_TOKEN: z.string().min(1, 'UPLOADTHING_TOKEN is required'),

  // * 邮件通知
  SMTP_HOST: optionalEnvString,
  SMTP_PORT: optionalEnvString,
  SMTP_SECURE: optionalEnvBooleanString,
  SMTP_USER: optionalEnvString,
  SMTP_PASS: optionalEnvString,
  MAIL_FROM: optionalEnvString,
  MAIL_TO: optionalEnvString,
})

const serverEnvSource = {
  DATABASE_URL: process.env.DATABASE_URL,
  SITE_URL: process.env.SITE_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  MAIL_FROM: process.env.MAIL_FROM,
  MAIL_TO: process.env.MAIL_TO,
}

export const serverEnv = serverEnvSchema.parse(serverEnvSource)
