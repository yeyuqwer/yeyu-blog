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

export const createNoteSchema = z.object({
  title: noteTitleSchema,
  slug: noteSlugSchema,
  isPublished: z.boolean(),
  relatedTagNames: z.array(z.string()).max(3, { message: '最多只能选择 3 个标签' }),
  content: z.string(),
})

export const updateNoteSchema = z
  .object({
    id: z.number(),
  })
  .merge(createNoteSchema)
