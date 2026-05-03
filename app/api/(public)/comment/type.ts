import { z } from 'zod'

export const siteCommentTargetTypeSchema = z.enum(['BLOG', 'NOTE'])

export const siteCommentStateSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

export const getPublicCommentsQuerySchema = z.object({
  targetType: siteCommentTargetTypeSchema,
  targetId: z.coerce.number().int().positive({ message: 'Invalid targetId.' }),
  take: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
})

export const createCommentSchema = z.object({
  targetType: siteCommentTargetTypeSchema,
  targetId: z.number().int().positive({ message: 'Invalid targetId.' }),
  parentId: z.number().int().positive({ message: 'Invalid parentId.' }).optional(),
  content: z.string().trim().min(1, { message: 'Comment content cannot be empty.' }).max(500, {
    message: 'Comment content cannot exceed 500 characters.',
  }),
})

export const deleteCommentQuerySchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
})
