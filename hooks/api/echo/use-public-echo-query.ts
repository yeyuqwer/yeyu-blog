import { useQuery } from '@tanstack/react-query'
import { type GetPublicEchosParams, getPublicEchos } from '@/lib/api/echo'

export type UsePublicEchoQueryParams = GetPublicEchosParams

export function usePublicEchoQuery(params: UsePublicEchoQueryParams = {}) {
  const { q = '' } = params

  return useQuery({
    queryKey: ['public-echo-list', q],
    queryFn: () => getPublicEchos({ q }),
    staleTime: 1000 * 30,
  })
}
