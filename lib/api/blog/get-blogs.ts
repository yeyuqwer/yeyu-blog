import type { BlogListItem } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetBlogsParams = {
  q?: string
  tagNames?: string[]
}

export async function getBlogs(params: GetBlogsParams = {}) {
  const { q, tagNames } = params
  const normalizedTagNames = tagNames?.map(value => value.trim()).filter(value => value.length > 0)

  return await apiRequest<BlogListItem[]>({
    url: 'admin/blog',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
      tagNames:
        normalizedTagNames != null && normalizedTagNames.length > 0
          ? normalizedTagNames.join(',')
          : undefined,
    },
  })
}
