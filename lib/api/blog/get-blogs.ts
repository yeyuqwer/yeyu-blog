import type { BlogListItem } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetBlogsParams = {
  q?: string
  tagNames?: string[]
  take?: number
  skip?: number
}

export type GetBlogsResponse = {
  list: BlogListItem[]
  total: number
  take: number
  skip: number
}

export async function getBlogs(params: GetBlogsParams = {}) {
  const { q, tagNames, take = 15, skip = 0 } = params
  const normalizedTagNames = tagNames?.map(value => value.trim()).filter(value => value.length > 0)

  return await apiRequest<GetBlogsResponse>({
    url: 'admin/blog',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
      take: String(take),
      skip: String(skip),
      tagNames:
        normalizedTagNames != null && normalizedTagNames.length > 0
          ? normalizedTagNames.join(',')
          : undefined,
    },
  })
}
