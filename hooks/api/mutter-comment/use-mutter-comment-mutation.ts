import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { createMutterComment } from '@/lib/api/mutter-comment'

export function useMutterCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutterComment,
    onSuccess: async (data, variables) => {
      sileo.success({
        title: data.data.state === 'APPROVED' ? '评论已发布' : '评论已提交，等待审核',
      })
      await queryClient.invalidateQueries({
        queryKey: ['public-mutter-comment-list', variables.mutterId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['admin-mutter-comment-list'],
      })
    },
    onError: () => {
      sileo.error({ title: '评论提交失败' })
    },
  })
}
