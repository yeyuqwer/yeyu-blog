import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBlog } from '@/lib/api/blog'

export type ToggleBlogPublishParams = {
  id: number
  isPublished: boolean
}

export function useBlogPublishMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isPublished }: ToggleBlogPublishParams) =>
      updateBlog({
        id,
        isPublished,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['blog-list'] }),
        queryClient.invalidateQueries({ queryKey: ['public-blog-list'] }),
      ])
    },
  })
}
