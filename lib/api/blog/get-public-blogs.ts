import type { BlogListItem } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetPublicBlogsParams = {
  q?: string
}

export async function getPublicBlogs(params: GetPublicBlogsParams = {}) {
  const { q } = params

  return await apiRequest<BlogListItem[]>({
    url: 'blog',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
    },
  })
}
