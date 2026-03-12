import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMutterComment } from '@/lib/api/mutter-comment'

export function useMutterCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutterComment,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['public-mutter-comment-list', variables.mutterId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['admin-mutter-comment-list'],
      })
    },
  })
}
