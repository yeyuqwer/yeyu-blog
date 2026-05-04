import { TagType } from '@prisma/client'
import { z } from 'zod'

const tagNameSchema = z
  .string()
  .trim()
  .min(1, { message: '标签名不能为空' })
  .max(20, { message: '标签名超出大小限制' })

export const createTagSchema = z.object({
  tagName: tagNameSchema,
  tagType: z.nativeEnum(TagType),
})

export const updateTagNameSchema = z
  .object({
    id: z.number(),
  })
  .merge(createTagSchema)
