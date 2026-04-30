import { useQuery } from '@tanstack/react-query'
import { type GetPublicFriendLinksParams, getPublicFriendLinks } from '@/lib/api/friend-link'

export function usePublicFriendLinkQuery(params: GetPublicFriendLinksParams = {}) {
  const { take = 100, skip = 0 } = params

  return useQuery({
    queryKey: ['public-friend-link-list', take, skip],
    queryFn: () =>
      getPublicFriendLinks({
        take,
        skip,
      }),
    staleTime: 1000 * 60,
  })
}
