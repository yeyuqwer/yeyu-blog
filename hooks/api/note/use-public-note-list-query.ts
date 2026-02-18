import { useQuery } from '@tanstack/react-query'
import { type GetPublicNotesParams, getPublicNotes } from '@/lib/api/note'

export type UsePublicNoteListQueryParams = GetPublicNotesParams

export function usePublicNoteListQuery(params: UsePublicNoteListQueryParams = {}) {
  const { q = '' } = params

  return useQuery({
    queryKey: ['public-note-list', q],
    queryFn: () => getPublicNotes({ q }),
    staleTime: 1000 * 30,
  })
}
