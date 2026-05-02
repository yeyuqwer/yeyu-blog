import { useQuery, useQueryClient } from '@tanstack/react-query'
import { type BlogListItem, type GetBlogsParams, getBlogs } from '@/lib/api/blog'
import { getCachedPaginatedQueryData } from '../get-cached-paginated-query-data'

export type UseBlogQueryParams = GetBlogsParams

export function useBlogQuery(params: UseBlogQueryParams = {}) {
  const { q = '', tagNames = [], take = 15, skip = 0 } = params
  const queryClient = useQueryClient()
  const cachedData = getCachedPaginatedQueryData<BlogListItem>(queryClient, {
    queryKey: ['blog-list', q, tagNames],
    skip,
    take,
  })

  return useQuery({
    queryKey: ['blog-list', q, tagNames, take, skip],
    queryFn: () => getBlogs({ q, tagNames, take, skip }),
    initialData: cachedData?.data,
    initialDataUpdatedAt: cachedData?.updatedAt,
    staleTime: 1000 * 30,
  })
}
