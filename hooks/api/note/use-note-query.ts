import { useQuery, useQueryClient } from '@tanstack/react-query'
import { type GetNotesParams, getNotes, type NoteListItem } from '@/lib/api/note'
import { getCachedPaginatedQueryData } from '../get-cached-paginated-query-data'

export type UseNoteQueryParams = GetNotesParams

export function useNoteQuery(params: UseNoteQueryParams = {}) {
  const { q = '', tagNames = [], take = 15, skip = 0 } = params
  const queryClient = useQueryClient()
  const cachedData = getCachedPaginatedQueryData<NoteListItem>(queryClient, {
    queryKey: ['note-list', q, tagNames],
    skip,
    take,
  })

  return useQuery({
    queryKey: ['note-list', q, tagNames, take, skip],
    queryFn: () => getNotes({ q, tagNames, take, skip }),
    initialData: cachedData?.data,
    initialDataUpdatedAt: cachedData?.updatedAt,
    staleTime: 1000 * 30,
  })
}
