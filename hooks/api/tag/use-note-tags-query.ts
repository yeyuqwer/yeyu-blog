import { useQuery } from '@tanstack/react-query'
import { getNoteTags } from '@/lib/api/tag'

export type UseNoteTagsQueryParams = {
  enabled?: boolean
}

export function useNoteTagsQuery(params: UseNoteTagsQueryParams = {}) {
  const { enabled = true } = params

  return useQuery({
    queryKey: ['note-tags'],
    queryFn: getNoteTags,
    staleTime: 1000 * 30,
    enabled,
  })
}
