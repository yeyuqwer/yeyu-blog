import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { deleteEcho } from '@/lib/api/echo'

export function useEchoDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEcho,
    onSuccess: async () => {
      sileo.success({ title: '删除成功' })
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['echo-list'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['public-echo-list'],
        }),
      ])
    },
    onError: () => {
      sileo.error({ title: '删除失败' })
    },
  })
}
