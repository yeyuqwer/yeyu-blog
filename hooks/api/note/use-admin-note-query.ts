import { useQuery } from '@tanstack/react-query'
import { getAdminNoteBySlug } from '@/lib/api/note'

export type UseAdminNoteQueryParams = {
  slug: string
  enabled?: boolean
}

export function useAdminNoteQuery(params: UseAdminNoteQueryParams) {
  const { slug, enabled = true } = params

  return useQuery({
    queryKey: ['admin-note-detail', slug],
    queryFn: () =>
      getAdminNoteBySlug({
        slug,
      }),
    staleTime: 1000 * 30,
    enabled: enabled && slug.trim().length > 0,
  })
}
