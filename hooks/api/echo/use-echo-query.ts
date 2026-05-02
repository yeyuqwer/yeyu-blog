import { useQuery, useQueryClient } from '@tanstack/react-query'
import { type EchoRecord, type GetEchosParams, getEchos } from '@/lib/api/echo'
import { getCachedPaginatedQueryData } from '../get-cached-paginated-query-data'

export type UseEchoQueryParams = GetEchosParams

export function useEchoQuery(params: UseEchoQueryParams = {}) {
  const { q = '', take = 15, skip = 0 } = params
  const queryClient = useQueryClient()
  const cachedData = getCachedPaginatedQueryData<EchoRecord>(queryClient, {
    queryKey: ['echo-list', q],
    skip,
    take,
  })

  return useQuery({
    queryKey: ['echo-list', q, take, skip],
    queryFn: () => getEchos({ q, take, skip }),
    initialData: cachedData?.data,
    initialDataUpdatedAt: cachedData?.updatedAt,
    staleTime: 1000 * 30,
  })
}
