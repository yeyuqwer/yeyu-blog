import { useQuery, useQueryClient } from '@tanstack/react-query'
import { type GetTagsParams, getTags, type WithCountTagDTO } from '@/lib/api/tag'
import { getCachedPaginatedQueryData } from '../get-cached-paginated-query-data'

export type UseTagsQueryParams = GetTagsParams

export function useTagsQuery(params: UseTagsQueryParams = {}) {
  const { q = '', take = 15, skip = 0 } = params
  const queryClient = useQueryClient()
  const cachedData = getCachedPaginatedQueryData<WithCountTagDTO>(queryClient, {
    queryKey: ['tags', q],
    skip,
    take,
  })

  return useQuery({
    queryKey: ['tags', q, take, skip],
    queryFn: () => getTags({ q, take, skip }),
    initialData: cachedData?.data,
    initialDataUpdatedAt: cachedData?.updatedAt,
    staleTime: 1000 * 30,
  })
}
