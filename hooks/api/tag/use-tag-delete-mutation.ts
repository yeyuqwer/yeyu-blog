import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { deleteTag } from '@/lib/api/tag'

export function useTagDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTag,
    onSuccess: async (_, variables) => {
      sileo.success({ title: `删除标签 #${variables.tagName} 成功` })
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['tags'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['blog-tags'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['note-tags'],
        }),
      ])
    },
    onError: () => {
      sileo.error({ title: '删除标签失败' })
    },
  })
}
