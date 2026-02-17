import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMutter } from '@/lib/api/mutter'

export type UpdateMutterMutationParams = {
  id: number
  content?: string
  isPublished?: boolean
}

export function useMutterUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, content, isPublished }: UpdateMutterMutationParams) =>
      updateMutter({
        id,
        content,
        isPublished,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['mutter-list'],
      })
    },
  })
}
