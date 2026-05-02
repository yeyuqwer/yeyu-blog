import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminPendingCountQueryKey } from '@/hooks/api/admin'
import { updateComment } from '@/lib/api/comment'

export function useAdminCommentStateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateComment,
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
