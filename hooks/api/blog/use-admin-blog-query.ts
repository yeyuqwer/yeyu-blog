import { useQuery } from '@tanstack/react-query'
import { getAdminBlogBySlug } from '@/lib/api/blog'

export type UseAdminBlogQueryParams = {
  slug: string
  enabled?: boolean
}

export function useAdminBlogQuery(params: UseAdminBlogQueryParams) {
  const { slug, enabled = true } = params

  return useQuery({
    queryKey: ['admin-blog-detail', slug],
    queryFn: () =>
      getAdminBlogBySlug({
        slug,
      }),
    staleTime: 1000 * 30,
    enabled: enabled && slug.trim().length > 0,
  })
}
