import { z } from 'zod'

export const mutterCommentStateSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

export const getAdminMutterCommentsQuerySchema = z.object({
  q: z.string().trim().optional(),
  mutterId: z.coerce.number().int().positive({ message: 'Invalid mutterId.' }).optional(),
  state: mutterCommentStateSchema.optional(),
  take: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
})

export const updateMutterCommentSchema = z.object({
  id: z.number().int().positive({ message: 'Invalid id.' }),
  state: mutterCommentStateSchema,
})

export const deleteMutterCommentQuerySchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
})
