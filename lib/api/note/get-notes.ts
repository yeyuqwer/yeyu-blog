import type { NoteListItem } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetNotesParams = {
  q?: string
  tagNames?: string[]
}

export async function getNotes(params: GetNotesParams = {}) {
  const { q, tagNames } = params
  const normalizedTagNames = tagNames?.map(value => value.trim()).filter(value => value.length > 0)

  return await apiRequest<NoteListItem[]>({
    url: 'admin/note',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
      tagNames:
        normalizedTagNames != null && normalizedTagNames.length > 0
          ? normalizedTagNames.join(',')
          : undefined,
    },
  })
}
