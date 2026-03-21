import { useQuery } from '@tanstack/react-query'
import { type GetPublicCommentsParams, getPublicComments } from '@/lib/api/comment'

export type UsePublicCommentQueryParams = GetPublicCommentsParams & {
  enabled?: boolean
}

export function usePublicCommentQuery(params: UsePublicCommentQueryParams) {
  const { targetType, targetId, take = 20, skip = 0, enabled = true } = params

  return useQuery({
    queryKey: ['public-comment-list', targetType, targetId, take, skip],
    queryFn: () =>
      getPublicComments({
        targetType,
        targetId,
        take,
        skip,
      }),
    staleTime: 1000 * 30,
    enabled: enabled && targetId > 0,
  })
}
