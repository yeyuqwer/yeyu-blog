import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBlog } from '@/lib/api/blog'

export function useBlogCreateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBlog,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['blog-list'] }),
        queryClient.invalidateQueries({ queryKey: ['public-blog-list'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
      ])
    },
  })
}
