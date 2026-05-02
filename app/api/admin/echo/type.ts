import { z } from 'zod'

const echoContentSchema = z
  .string()
  .trim()
  .min(1, { message: '引用不能为空' })
  .max(100, { message: '引用长度过长' })

const echoReferenceSchema = z
  .string()
  .trim()
  .min(1, { message: '来源不能为空' })
  .max(20, { message: '来源长度过长' })

export const getEchosQuerySchema = z.object({
  q: z.string().trim().optional(),
  take: z.coerce.number().int().min(1).max(100).default(15),
  skip: z.coerce.number().int().min(0).default(0),
})

export const createEchoSchema = z.object({
  content: echoContentSchema,
  reference: echoReferenceSchema,
  isPublished: z.boolean().default(true),
})

export const updateEchoSchema = z
  .object({
    id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
    content: echoContentSchema.optional(),
    reference: echoReferenceSchema.optional(),
    isPublished: z.boolean().optional(),
  })
  .refine(
    values => values.content != null || values.reference != null || values.isPublished != null,
    {
      message: 'At least one field must be provided for update.',
    },
  )

export const deleteEchoQuerySchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
})
