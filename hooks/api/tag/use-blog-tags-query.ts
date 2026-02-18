import { useQuery } from '@tanstack/react-query'
import { getBlogTags } from '@/lib/api/tag'

export type UseBlogTagsQueryParams = {
  enabled?: boolean
}

export function useBlogTagsQuery(params: UseBlogTagsQueryParams = {}) {
  const { enabled = true } = params

  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: getBlogTags,
    staleTime: 1000 * 30,
    enabled,
  })
}
