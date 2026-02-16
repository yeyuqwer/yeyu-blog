import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMutter } from '@/lib/api/mutter'

export function useMutterMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutter,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['mutter-list'],
      })
    },
  })
}
