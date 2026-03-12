import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { createMutterComment } from '@/lib/api/mutter-comment'

export function useMutterCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutterComment,
    onSuccess: async (data, variables) => {
      sileo.success({ title: data.message })
      await queryClient.invalidateQueries({
        queryKey: ['public-mutter-comment-list', variables.mutterId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['admin-mutter-comment-list'],
      })
    },
    onError: error => {
      if (error instanceof Error) {
        sileo.error({ title: error.message })
      } else {
        sileo.error({ title: 'Failed to submit comment.' })
      }
    },
  })
}
