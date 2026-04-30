import { z } from 'zod'

export const friendLinkStateSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

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

export const getAdminFriendLinksQuerySchema = z.object({
  q: z.string().trim().optional(),
  state: friendLinkStateSchema.optional(),
  take: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
})

export const updateFriendLinkSchema = z
  .object({
    id: z.number().int().positive({ message: 'Invalid id.' }),
    name: friendLinkNameSchema.optional(),
    description: friendLinkDescriptionSchema.optional(),
    avatarUrl: friendLinkUrlSchema.optional(),
    siteUrl: friendLinkUrlSchema.optional(),
    state: friendLinkStateSchema.optional(),
  })
  .refine(
    values =>
      values.name != null ||
      values.description != null ||
      values.avatarUrl != null ||
      values.siteUrl != null ||
      values.state != null,
    {
      message: 'At least one field must be provided for update.',
    },
  )

export const deleteFriendLinkQuerySchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
})
