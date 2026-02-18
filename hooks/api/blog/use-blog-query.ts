import { useQuery } from '@tanstack/react-query'
import { type GetBlogsParams, getBlogs } from '@/lib/api/blog'

export type UseBlogQueryParams = GetBlogsParams

export function useBlogQuery(params: UseBlogQueryParams = {}) {
  const { q = '', tagNames = [] } = params

  return useQuery({
    queryKey: ['blog-list', q, tagNames],
    queryFn: () => getBlogs({ q, tagNames }),
    staleTime: 1000 * 30,
  })
}
