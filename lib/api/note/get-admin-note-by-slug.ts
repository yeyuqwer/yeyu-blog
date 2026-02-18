import type { RawNoteRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetAdminNoteBySlugParams = {
  slug: string
}

export async function getAdminNoteBySlug(params: GetAdminNoteBySlugParams) {
  const { slug } = params

  return await apiRequest<RawNoteRecord | null>({
    url: `admin/note/${encodeURIComponent(slug)}`,
    method: 'GET',
  })
}
