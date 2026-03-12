import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likeMutter } from '@/lib/api/mutter'

export function useMutterLikeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: likeMutter,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['public-mutter-list'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['mutter-list'],
      })
    },
  })
}
