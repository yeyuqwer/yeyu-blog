import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMutterComment } from '@/lib/api/mutter-comment'

export function useAdminMutterCommentStateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMutterComment,
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
