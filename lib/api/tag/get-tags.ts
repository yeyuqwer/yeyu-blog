import type { WithCountTagDTO } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetTagsParams = {
  q?: string
}

export async function getTags(params: GetTagsParams = {}) {
  const { q } = params

  return await apiRequest<WithCountTagDTO[]>({
    url: 'admin/tag',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
    },
  })
}
