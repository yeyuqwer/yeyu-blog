import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCommentConfig } from '@/lib/api/comment'

export function useCommentConfigMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCommentConfig,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['comment-config'],
      })
    },
  })
}
