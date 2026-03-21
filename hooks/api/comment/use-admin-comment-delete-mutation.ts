import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteComment } from '@/lib/api/comment'

export function useAdminCommentDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin-comment-list'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['public-comment-list'],
      })
    },
  })
}
