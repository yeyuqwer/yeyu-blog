import type { TagType } from '@prisma/client'
import { z } from 'zod'

export const CreateBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: '长度不能少于1个字符' })
    .max(50, { message: '标题超出大小限制' }),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, {
      message: '只允许输入数字、小写字母和中横线',
    })
    .min(1, { message: '长度不能少于1个字符' }),
  isPublished: z.boolean(),
  relatedTagNames: z.array(z.string()).max(3, { message: '最多只能选择 3 个标签' }),
  content: z.string(),
})

export const UpdateBlogSchema = z
  .object({
    id: z.number(),
  })
  .merge(CreateBlogSchema)

export type CreateBlogDTO = z.infer<typeof CreateBlogSchema>
export type UpdateBlogDTO = z.infer<typeof UpdateBlogSchema>

export type UpdateBlogParams = {
  id: number
  title?: string
  slug?: string
  isPublished?: boolean
  relatedTagNames?: string[]
  content?: string
}

export type BlogTagRecord = {
  id: number
  tagName: string
  tagType: TagType
}

export type BlogListItem = {
  id: number
  slug: string
  title: string
  isPublished: boolean
  createdAt: Date | string
  updatedAt: Date | string
  tags: BlogTagRecord[]
}

export type RawBlogRecord = {
  id: number
  slug: string
  title: string
  content: string
  isPublished: boolean
  createdAt: Date | string
  updatedAt: Date | string
  tags: BlogTagRecord[]
}

export type PublishedBlogDetailRecord = RawBlogRecord
