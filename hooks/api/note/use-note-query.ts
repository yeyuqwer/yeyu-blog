import { useQuery } from '@tanstack/react-query'
import { type GetNotesParams, getNotes } from '@/lib/api/note'

export type UseNoteQueryParams = GetNotesParams

export function useNoteQuery(params: UseNoteQueryParams = {}) {
  const { q = '', tagNames = [] } = params

  return useQuery({
    queryKey: ['note-list', q, tagNames],
    queryFn: () => getNotes({ q, tagNames }),
    staleTime: 1000 * 30,
  })
}
