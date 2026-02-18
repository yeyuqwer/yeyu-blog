import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteEcho } from '@/lib/api/echo'

export function useEchoDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEcho,
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
