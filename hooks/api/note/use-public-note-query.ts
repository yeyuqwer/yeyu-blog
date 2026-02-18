import { useQuery } from '@tanstack/react-query'
import { getPublicNoteBySlug } from '@/lib/api/note'

export type UsePublicNoteQueryParams = {
  slug: string
  enabled?: boolean
}

export function usePublicNoteQuery(params: UsePublicNoteQueryParams) {
  const { slug, enabled = true } = params

  return useQuery({
    queryKey: ['public-note-detail', slug],
    queryFn: () =>
      getPublicNoteBySlug({
        slug,
      }),
    staleTime: 1000 * 30,
    enabled: enabled && slug.trim().length > 0,
  })
}
