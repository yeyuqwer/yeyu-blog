import { useQuery } from '@tanstack/react-query'
import { getPublicBlogBySlug } from '@/lib/api/blog'

export type UsePublicBlogQueryParams = {
  slug: string
  enabled?: boolean
}

export function usePublicBlogQuery(params: UsePublicBlogQueryParams) {
  const { slug, enabled = true } = params

  return useQuery({
    queryKey: ['public-blog-detail', slug],
    queryFn: () =>
      getPublicBlogBySlug({
        slug,
      }),
    staleTime: 1000 * 30,
    enabled: enabled && slug.trim().length > 0,
  })
}
