import { useQuery } from '@tanstack/react-query'
import { type GetTagsParams, getTags } from '@/lib/api/tag'

export type UseTagsQueryParams = GetTagsParams

export function useTagsQuery(params: UseTagsQueryParams = {}) {
  const { q = '' } = params

  return useQuery({
    queryKey: ['tags', q],
    queryFn: () => getTags({ q }),
    staleTime: 1000 * 30,
  })
}
