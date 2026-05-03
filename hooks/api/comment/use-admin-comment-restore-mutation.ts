import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminPendingCountQueryKey } from '@/hooks/api/admin'
import { restoreComment } from '@/lib/api/comment'

export function useAdminCommentRestoreMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number }) =>
      restoreComment({
        id: params.id,
        isDeleted: false,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin-comment-list'],
      })
      await queryClient.invalidateQueries({
        queryKey: adminPendingCountQueryKey,
      })
      await queryClient.invalidateQueries({
        queryKey: ['public-comment-list'],
      })
    },
  })
}
