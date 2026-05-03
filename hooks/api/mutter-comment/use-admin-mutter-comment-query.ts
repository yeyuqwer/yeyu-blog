import { useQuery } from '@tanstack/react-query'
import { type GetAdminMutterCommentsParams, getAdminMutterComments } from '@/lib/api/mutter-comment'

export type UseAdminMutterCommentQueryParams = GetAdminMutterCommentsParams

export function useAdminMutterCommentQuery(params: UseAdminMutterCommentQueryParams = {}) {
  const { q = '', mutterId, state, isDeleted, take = 20, skip = 0 } = params

  return useQuery({
    queryKey: [
      'admin-mutter-comment-list',
      q,
      mutterId ?? 'all',
      state ?? 'all',
      isDeleted ?? 'all',
      take,
      skip,
    ],
    queryFn: () =>
      getAdminMutterComments({
        q,
        mutterId,
        state,
        isDeleted,
        take,
        skip,
      }),
    staleTime: 1000 * 30,
  })
}
