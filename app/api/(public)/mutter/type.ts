import { z } from 'zod'

export const getPublicMuttersQuerySchema = z.object({
  q: z.string().trim().optional(),
  take: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
})
