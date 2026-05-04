import type { TagType } from '@prisma/client'

export type CreateTagDTO = {
  tagName: string
  tagType: TagType
}

export type UpdateTagNameDTO = CreateTagDTO & {
  id: number
}
export type DeleteTagDTO = UpdateTagNameDTO

export type TagOptionRecord = {
  id: number
  tagName: string
  tagType: TagType
}

export type WithCountTagDTO = UpdateTagNameDTO & {
  count: number
}
