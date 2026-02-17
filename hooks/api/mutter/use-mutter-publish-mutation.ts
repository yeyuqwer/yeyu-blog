import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMutter } from '@/lib/api/mutter'

export type ToggleMutterPublishParams = {
  id: number
  isPublished: boolean
}

export function useMutterPublishMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isPublished }: ToggleMutterPublishParams) =>
      updateMutter({
        id,
        isPublished,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['mutter-list'],
      })
    },
  })
}
