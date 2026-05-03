import { z } from 'zod'

export const mutterCommentStateSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

export const getAdminMutterCommentsQuerySchema = z.object({
  q: z.string().trim().optional(),
  mutterId: z.coerce.number().int().positive({ message: 'Invalid mutterId.' }).optional(),
  state: mutterCommentStateSchema.optional(),
  isDeleted: z
    .enum(['true', 'false'])
    .transform(value => value === 'true')
    .optional(),
  take: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
})

export const updateMutterCommentStateSchema = z.object({
  id: z.number().int().positive({ message: 'Invalid id.' }),
  state: mutterCommentStateSchema,
})

export const restoreMutterCommentSchema = z.object({
  id: z.number().int().positive({ message: 'Invalid id.' }),
  isDeleted: z.literal(false),
})

export const updateMutterCommentSchema = z.union([
  updateMutterCommentStateSchema,
  restoreMutterCommentSchema,
])

export const deleteMutterCommentQuerySchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
})
