import { z } from 'zod'

export const getPublicMutterCommentsQuerySchema = z.object({
  mutterId: z.coerce.number().int().positive({ message: 'Invalid mutterId.' }),
  take: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
})

export const createMutterCommentSchema = z.object({
  mutterId: z.number().int().positive({ message: 'Invalid mutterId.' }),
  content: z.string().trim().min(1, { message: 'Comment content cannot be empty.' }).max(500, {
    message: 'Comment content cannot exceed 500 characters.',
  }),
})
