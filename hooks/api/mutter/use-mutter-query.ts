import { useQuery } from '@tanstack/react-query'
import { type GetMuttersParams, getMutters } from '@/lib/api/mutter/get-mutters'

export type UseMutterQueryParams = GetMuttersParams

export function useMutterQuery(params: UseMutterQueryParams = {}) {
  const { q = '', isPublished, take = 20, skip = 0 } = params

  return useQuery({
    queryKey: ['mutter-list', q, isPublished ?? 'all', take, skip],
    queryFn: () => getMutters({ q, isPublished, take, skip }),
    staleTime: 1000 * 30,
  })
}
