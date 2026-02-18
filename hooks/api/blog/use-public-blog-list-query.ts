import { useQuery } from '@tanstack/react-query'
import { type GetPublicBlogsParams, getPublicBlogs } from '@/lib/api/blog'

export type UsePublicBlogListQueryParams = GetPublicBlogsParams

export function usePublicBlogListQuery(params: UsePublicBlogListQueryParams = {}) {
  const { q = '' } = params

  return useQuery({
    queryKey: ['public-blog-list', q],
    queryFn: () => getPublicBlogs({ q }),
    staleTime: 1000 * 30,
  })
}
