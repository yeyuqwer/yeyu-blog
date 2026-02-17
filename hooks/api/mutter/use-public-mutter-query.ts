import { useQuery } from '@tanstack/react-query'
import { type GetPublicMuttersParams, getPublicMutters } from '@/lib/api/mutter'

export type UsePublicMutterQueryParams = GetPublicMuttersParams

export function usePublicMutterQuery(params: UsePublicMutterQueryParams = {}) {
  const { q = '', take = 20, skip = 0 } = params

  return useQuery({
    queryKey: ['public-mutter-list', q, take, skip],
    queryFn: () => getPublicMutters({ q, take, skip }),
    staleTime: 1000 * 30,
  })
}
