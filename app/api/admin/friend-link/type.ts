import { z } from 'zod'

export const friendLinkStateSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

export const getAdminFriendLinksQuerySchema = z.object({
  q: z.string().trim().optional(),
  state: friendLinkStateSchema.optional(),
  take: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
})

export const updateFriendLinkSchema = z.object({
  id: z.number().int().positive({ message: 'Invalid id.' }),
  state: friendLinkStateSchema,
})

export const deleteFriendLinkQuerySchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
})
