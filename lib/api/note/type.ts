import type { TagType } from '@prisma/client'

export type CreateNoteDTO = {
  title: string
  slug: string
  isPublished: boolean
  relatedTagNames: string[]
  content: string
}

export type UpdateNoteDTO = CreateNoteDTO & {
  id: number
}

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
