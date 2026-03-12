import { useQuery } from '@tanstack/react-query'
import {
  type GetPublicMutterCommentsParams,
  getPublicMutterComments,
} from '@/lib/api/mutter-comment'

export type UsePublicMutterCommentQueryParams = GetPublicMutterCommentsParams & {
  enabled?: boolean
}

export function usePublicMutterCommentQuery(params: UsePublicMutterCommentQueryParams) {
  const { mutterId, take = 20, skip = 0, enabled = true } = params

  return useQuery({
    queryKey: ['public-mutter-comment-list', mutterId, take, skip],
    queryFn: () =>
      getPublicMutterComments({
        mutterId,
        take,
        skip,
      }),
    staleTime: 1000 * 30,
    enabled: enabled && mutterId > 0,
  })
}
