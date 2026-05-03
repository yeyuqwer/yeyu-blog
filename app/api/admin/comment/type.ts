import { z } from 'zod'

export const siteCommentTargetTypeSchema = z.enum(['BLOG', 'NOTE'])

export const siteCommentStateSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

export const getAdminCommentsQuerySchema = z.object({
  q: z.string().trim().optional(),
  targetType: siteCommentTargetTypeSchema.optional(),
  targetId: z.coerce.number().int().positive({ message: 'Invalid targetId.' }).optional(),
  state: siteCommentStateSchema.optional(),
  isDeleted: z
    .enum(['true', 'false'])
    .transform(value => value === 'true')
    .optional(),
  take: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
})

export const updateCommentStateSchema = z.object({
  id: z.number().int().positive({ message: 'Invalid id.' }),
  state: siteCommentStateSchema,
})

export const restoreCommentSchema = z.object({
  id: z.number().int().positive({ message: 'Invalid id.' }),
  isDeleted: z.literal(false),
})

export const updateCommentSchema = z.union([updateCommentStateSchema, restoreCommentSchema])

export const deleteCommentQuerySchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
})
