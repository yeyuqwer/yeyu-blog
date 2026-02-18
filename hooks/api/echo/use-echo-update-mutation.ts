import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateEcho } from '@/lib/api/echo'

export function useEchoUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateEcho,
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
