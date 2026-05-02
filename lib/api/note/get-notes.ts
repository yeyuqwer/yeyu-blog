import type { NoteListItem } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetNotesParams = {
  q?: string
  tagNames?: string[]
  take?: number
  skip?: number
}

export type GetNotesResponse = {
  list: NoteListItem[]
  total: number
  take: number
  skip: number
}

export async function getNotes(params: GetNotesParams = {}) {
  const { q, tagNames, take = 15, skip = 0 } = params
  const normalizedTagNames = tagNames?.map(value => value.trim()).filter(value => value.length > 0)

  return await apiRequest<GetNotesResponse>({
    url: 'admin/note',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
      take: String(take),
      skip: String(skip),
      tagNames:
        normalizedTagNames != null && normalizedTagNames.length > 0
          ? normalizedTagNames.join(',')
          : undefined,
    },
  })
}
