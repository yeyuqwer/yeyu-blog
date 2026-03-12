import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { deleteMutter } from '@/lib/api/mutter'

export type DeleteMutterMutationParams = {
  id: number
}

export function useMutterDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteMutterMutationParams) =>
      deleteMutter({
        id,
      }),
    onSuccess: async () => {
      sileo.success({ title: '删除成功' })
      await queryClient.invalidateQueries({
        queryKey: ['mutter-list'],
      })
    },
    onError: () => {
      sileo.error({ title: '删除失败' })
    },
  })
}
