import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteMutterComment } from '@/lib/api/mutter-comment'

export function useAdminMutterCommentDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMutterComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin-mutter-comment-list'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['public-mutter-comment-list'],
      })
    },
  })
}
