import { z } from 'zod'

export const getPublicEchosQuerySchema = z.object({
  q: z.string().trim().optional(),
})
