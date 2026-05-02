import { useQuery } from '@tanstack/react-query'
import { getAdminPendingCount } from '@/lib/api/admin'

export const adminPendingCountQueryKey = ['admin-pending-count'] as const

export function useAdminPendingCountQuery() {
  return useQuery({
    queryKey: adminPendingCountQueryKey,
    queryFn: getAdminPendingCount,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })
}
