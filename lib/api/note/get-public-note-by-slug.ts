import type { PublishedNoteDetailRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetPublicNoteBySlugParams = {
  slug: string
}

export async function getPublicNoteBySlug(params: GetPublicNoteBySlugParams) {
  const { slug } = params

  return await apiRequest<PublishedNoteDetailRecord | null>({
    url: `note/${encodeURIComponent(slug)}`,
    method: 'GET',
  })
}
