import type { RawBlogRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetAdminBlogBySlugParams = {
  slug: string
}

export async function getAdminBlogBySlug(params: GetAdminBlogBySlugParams) {
  const { slug } = params

  return await apiRequest<RawBlogRecord | null>({
    url: `admin/blog/${encodeURIComponent(slug)}`,
    method: 'GET',
  })
}
