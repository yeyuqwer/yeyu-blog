import { useQuery } from '@tanstack/react-query'
import { type GetEchosParams, getEchos } from '@/lib/api/echo'

export type UseEchoQueryParams = GetEchosParams

export function useEchoQuery(params: UseEchoQueryParams = {}) {
  const { q = '' } = params

  return useQuery({
    queryKey: ['echo-list', q],
    queryFn: () => getEchos({ q }),
    staleTime: 1000 * 30,
  })
}
