import { z } from 'zod'

export const getPublicNotesQuerySchema = z.object({
  q: z.string().trim().optional(),
})
