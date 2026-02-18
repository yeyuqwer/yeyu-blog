import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTag } from '@/lib/api/tag'

export function useTagDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTag,
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
