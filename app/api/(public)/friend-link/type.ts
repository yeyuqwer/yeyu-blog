import { z } from 'zod'

const friendLinkNameSchema = z
  .string()
  .trim()
  .min(1, { message: '站点名称不能为空' })
  .max(50, { message: '站点名称不能超过 50 个字符' })

const friendLinkDescriptionSchema = z
  .string()
  .trim()
  .min(1, { message: '站点描述不能为空' })
  .max(120, { message: '站点描述不能超过 120 个字符' })

const friendLinkUrlSchema = z
  .string()
  .trim()
  .url({ message: '请输入有效的 HTTPS 链接' })
  .refine(value => value.startsWith('https://'), {
    message: '链接需要使用 HTTPS',
  })

export const getPublicFriendLinksQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(100).default(100),
  skip: z.coerce.number().int().min(0).default(0),
})

export const createFriendLinkSchema = z.object({
  name: friendLinkNameSchema,
  description: friendLinkDescriptionSchema,
  avatarUrl: friendLinkUrlSchema,
  siteUrl: friendLinkUrlSchema,
})
