import type { TagType } from '@prisma/client'
import { z } from 'zod'

export const CreateNoteSchema = z.object({
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

export const UpdateNoteSchema = z
  .object({
    id: z.number(),
  })
  .merge(CreateNoteSchema)

export type CreateNoteDTO = z.infer<typeof CreateNoteSchema>
export type UpdateNoteDTO = z.infer<typeof UpdateNoteSchema>

export type UpdateNoteParams = {
  id: number
  title?: string
  slug?: string
  isPublished?: boolean
  relatedTagNames?: string[]
  content?: string
}

export type NoteTagRecord = {
  id: number
  tagName: string
  tagType: TagType
}

export type NoteListItem = {
  id: number
  slug: string
  title: string
  isPublished: boolean
  createdAt: Date | string
  updatedAt: Date | string
  tags: NoteTagRecord[]
}

export type RawNoteRecord = {
  id: number
  slug: string
  title: string
  content: string
  isPublished: boolean
  createdAt: Date | string
  updatedAt: Date | string
  tags: NoteTagRecord[]
}

export type PublishedNoteDetailRecord = RawNoteRecord
