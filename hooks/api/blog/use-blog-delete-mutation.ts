import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteBlog } from '@/lib/api/blog'

export function useBlogDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['blog-list'] }),
        queryClient.invalidateQueries({ queryKey: ['public-blog-list'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
      ])
    },
  })
}
