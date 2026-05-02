import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { createComment } from '@/lib/api/comment'

export function useCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createComment,
    onSuccess: async (data, variables) => {
      sileo.success({
        title: data.data.state === 'APPROVED' ? '评论已发布' : '评论已提交，等待审核',
      })
      await queryClient.invalidateQueries({
        queryKey: ['public-comment-list', variables.targetType, variables.targetId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['admin-comment-list'],
      })
    },
    onError: () => {
      sileo.error({ title: '评论提交失败' })
    },
  })
}
