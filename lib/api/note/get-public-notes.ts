import type { NoteListItem } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetPublicNotesParams = {
  q?: string
}

export async function getPublicNotes(params: GetPublicNotesParams = {}) {
  const { q } = params

  return await apiRequest<NoteListItem[]>({
    url: 'note',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
    },
  })
}
