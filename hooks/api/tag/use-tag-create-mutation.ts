import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTag } from '@/lib/api/tag'

export function useTagCreateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTag,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['tags'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['blog-tags'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['note-tags'],
        }),
      ])
    },
  })
}
