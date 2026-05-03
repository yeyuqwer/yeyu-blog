import type { CommentTargetType } from '@/lib/api/comment'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { adminPendingCountQueryKey } from '@/hooks/api/admin'
import { deleteOwnComment } from '@/lib/api/comment'

export function useCommentDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number; targetType: CommentTargetType; targetId: number }) =>
      deleteOwnComment({
        id: params.id,
      }),
    onSuccess: async (_data, variables) => {
      sileo.success({ title: '评论已删除' })
      await queryClient.invalidateQueries({
        queryKey: ['public-comment-list', variables.targetType, variables.targetId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['admin-comment-list'],
      })
      await queryClient.invalidateQueries({
        queryKey: adminPendingCountQueryKey,
      })
    },
    onError: () => {
      sileo.error({ title: '评论删除失败' })
    },
  })
}
