import { z } from 'zod'

const noteTitleSchema = z
  .string()
  .trim()
  .min(1, { message: '长度不能少于1个字符' })
  .max(50, { message: '标题超出大小限制' })

const noteSlugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]+$/, {
    message: '只允许输入数字、小写字母和中横线',
  })
  .min(1, { message: '长度不能少于1个字符' })

const noteContentSchema = z.string()

const noteRelatedTagNamesSchema = z.array(z.string()).max(3, { message: '最多只能选择 3 个标签' })

export const getNotesQuerySchema = z.object({
  q: z.string().trim().optional(),
  tagNames: z.string().trim().optional(),
  take: z.coerce.number().int().min(1).max(100).default(15),
  skip: z.coerce.number().int().min(0).default(0),
})

export const createNoteSchema = z.object({
  title: noteTitleSchema,
  slug: noteSlugSchema,
  isPublished: z.boolean(),
  relatedTagNames: noteRelatedTagNamesSchema,
  content: noteContentSchema,
})

export const updateNoteSchema = z
  .object({
    id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
    title: noteTitleSchema.optional(),
    slug: noteSlugSchema.optional(),
    isPublished: z.boolean().optional(),
    relatedTagNames: noteRelatedTagNamesSchema.optional(),
    content: noteContentSchema.optional(),
  })
  .refine(
    values =>
      values.title != null ||
      values.slug != null ||
      values.isPublished != null ||
      values.relatedTagNames != null ||
      values.content != null,
    {
      message: 'At least one field must be provided for update.',
    },
  )

export const deleteNoteQuerySchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
})
