import { z } from 'zod'

export const getPublicBlogsQuerySchema = z.object({
  q: z.string().trim().optional(),
})
