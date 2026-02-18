import { TagType } from '@prisma/client'
import { z } from 'zod'

const tagNameSchema = z
  .string()
  .trim()
  .min(1, { message: '标签名不能为空' })
  .max(20, { message: '标签名超出大小限制' })

export const getTagsQuerySchema = z.object({
  q: z.string().trim().optional(),
  tagType: z.nativeEnum(TagType).optional(),
})

export const createTagSchema = z.object({
  tagName: tagNameSchema,
  tagType: z.nativeEnum(TagType),
})

export const updateTagSchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
  tagName: tagNameSchema,
  tagType: z.nativeEnum(TagType),
})

export const deleteTagQuerySchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
  tagType: z.nativeEnum(TagType),
})
