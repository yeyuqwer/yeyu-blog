import { useQuery } from '@tanstack/react-query'
import { type GetAdminCommentsParams, getAdminComments } from '@/lib/api/comment'

export function useAdminCommentQuery(params: GetAdminCommentsParams) {
  const { q, targetType, targetId, state, isDeleted, take = 20, skip = 0 } = params

  return useQuery({
    queryKey: [
      'admin-comment-list',
      q,
      targetType ?? 'all',
      targetId ?? 'all',
      state ?? 'all',
      isDeleted ?? 'all',
      take,
      skip,
    ],
    queryFn: () =>
      getAdminComments({
        q,
        targetType,
        targetId,
        state,
        isDeleted,
        take,
        skip,
      }),
    staleTime: 1000 * 10,
  })
}
