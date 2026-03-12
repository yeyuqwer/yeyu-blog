import { z } from 'zod'

export const likeMutterSchema = z.object({
  mutterId: z.number().int().positive({ message: 'Invalid mutterId.' }),
})
