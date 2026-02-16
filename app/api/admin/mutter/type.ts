import { z } from 'zod'
import { MUTTER_CONTENT_MAX_LENGTH } from '@/ui/admin/constant'

export const getMuttersQuerySchema = z.object({
  q: z.string().trim().optional(),
  isPublished: z.enum(['true', 'false']).optional(),
  take: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
})

export const createMutterSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: 'Mutter content cannot be empty.' })
    .max(MUTTER_CONTENT_MAX_LENGTH, {
      message: `Mutter content cannot exceed ${MUTTER_CONTENT_MAX_LENGTH} characters.`,
    }),
  isPublished: z.boolean().default(true),
})

export const updateMutterSchema = z
  .object({
    id: z.number().int().positive({ message: 'Invalid id.' }),
    content: z
      .string()
      .trim()
      .min(1, { message: 'Mutter content cannot be empty.' })
      .max(MUTTER_CONTENT_MAX_LENGTH, {
        message: `Mutter content cannot exceed ${MUTTER_CONTENT_MAX_LENGTH} characters.`,
      })
      .optional(),
    isPublished: z.boolean().optional(),
  })
  .refine(values => values.content != null || values.isPublished != null, {
    message: 'At least one field must be provided for update.',
  })

export const deleteMutterQuerySchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
})
