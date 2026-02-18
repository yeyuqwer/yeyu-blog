import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEcho } from '@/lib/api/echo'

export function useEchoCreateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEcho,
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
