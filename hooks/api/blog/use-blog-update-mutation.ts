import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBlog } from '@/lib/api/blog'

export function useBlogUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBlog,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['blog-list'] }),
        queryClient.invalidateQueries({ queryKey: ['public-blog-list'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
      ])
    },
  })
}
