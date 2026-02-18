import { z } from 'zod'

const blogTitleSchema = z
  .string()
  .trim()
  .min(1, { message: '长度不能少于1个字符' })
  .max(50, { message: '标题超出大小限制' })

const blogSlugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]+$/, {
    message: '只允许输入数字、小写字母和中横线',
  })
  .min(1, { message: '长度不能少于1个字符' })

const blogContentSchema = z.string()

const blogRelatedTagNamesSchema = z.array(z.string()).max(3, { message: '最多只能选择 3 个标签' })

export const getBlogsQuerySchema = z.object({
  q: z.string().trim().optional(),
  tagNames: z.string().trim().optional(),
})

export const createBlogSchema = z.object({
  title: blogTitleSchema,
  slug: blogSlugSchema,
  isPublished: z.boolean(),
  relatedTagNames: blogRelatedTagNamesSchema,
  content: blogContentSchema,
})

export const updateBlogSchema = z
  .object({
    id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
    title: blogTitleSchema.optional(),
    slug: blogSlugSchema.optional(),
    isPublished: z.boolean().optional(),
    relatedTagNames: blogRelatedTagNamesSchema.optional(),
    content: blogContentSchema.optional(),
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

export const deleteBlogQuerySchema = z.object({
  id: z.coerce.number().int().positive({ message: 'Invalid id.' }),
})
