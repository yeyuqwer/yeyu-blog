import { useMutation, useQueryClient } from '@tanstack/react-query'
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
      await queryClient.invalidateQueries({
        queryKey: ['mutter-list'],
      })
    },
  })
}
