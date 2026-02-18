import type { PublishedBlogDetailRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetPublicBlogBySlugParams = {
  slug: string
}

export async function getPublicBlogBySlug(params: GetPublicBlogBySlugParams) {
  const { slug } = params

  return await apiRequest<PublishedBlogDetailRecord | null>({
    url: `blog/${encodeURIComponent(slug)}`,
    method: 'GET',
  })
}
