import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMutterCommentConfig } from '@/lib/api/mutter-comment'

export function useMutterCommentConfigMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMutterCommentConfig,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['mutter-comment-config'],
      })
    },
  })
}
