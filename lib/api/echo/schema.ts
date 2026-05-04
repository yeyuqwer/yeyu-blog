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

export const createEchoSchema = z.object({
  content: echoContentSchema,
  reference: echoReferenceSchema,
  isPublished: z.boolean(),
})

export const updateEchoSchema = z
  .object({
    id: z.number(),
  })
  .merge(createEchoSchema)
