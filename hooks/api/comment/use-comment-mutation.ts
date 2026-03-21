import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { createComment } from '@/lib/api/comment'

export function useCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createComment,
    onSuccess: async (data, variables) => {
      sileo.success({ title: data.message })
      await queryClient.invalidateQueries({
        queryKey: ['public-comment-list', variables.targetType, variables.targetId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['admin-comment-list'],
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
