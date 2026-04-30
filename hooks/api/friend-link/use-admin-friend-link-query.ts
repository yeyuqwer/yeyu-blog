import { useQuery } from '@tanstack/react-query'
import { type GetAdminFriendLinksParams, getAdminFriendLinks } from '@/lib/api/friend-link'

export function useAdminFriendLinkQuery(params: GetAdminFriendLinksParams) {
  const { q, state, take = 20, skip = 0 } = params

  return useQuery({
    queryKey: ['admin-friend-link-list', q, state ?? 'all', take, skip],
    queryFn: () =>
      getAdminFriendLinks({
        q,
        state,
        take,
        skip,
      }),
    staleTime: 1000 * 10,
  })
}
