import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateEcho } from '@/lib/api/echo'

export type ToggleEchoPublishParams = {
  id: number
  isPublished: boolean
}

export function useEchoPublishMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isPublished }: ToggleEchoPublishParams) =>
      updateEcho({
        id,
        isPublished,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['echo-list'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['public-echo-list'],
        }),
      ])
    },
  })
}
