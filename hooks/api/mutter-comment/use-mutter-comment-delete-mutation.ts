import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { adminPendingCountQueryKey } from '@/hooks/api/admin'
import { deleteOwnMutterComment } from '@/lib/api/mutter-comment'

export function useMutterCommentDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number; mutterId: number }) =>
      deleteOwnMutterComment({
        id: params.id,
      }),
    onSuccess: async (_data, variables) => {
      sileo.success({ title: '评论已删除' })
      await queryClient.invalidateQueries({
        queryKey: ['public-mutter-comment-list', variables.mutterId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['public-mutter-list'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['admin-mutter-comment-list'],
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
