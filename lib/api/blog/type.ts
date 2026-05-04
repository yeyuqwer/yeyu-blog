import type { TagType } from '@prisma/client'

export type CreateBlogDTO = {
  title: string
  slug: string
  isPublished: boolean
  relatedTagNames: string[]
  content: string
}

export type UpdateBlogDTO = CreateBlogDTO & {
  id: number
}

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
