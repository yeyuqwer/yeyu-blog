import type { WithCountTagDTO } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetTagsParams = {
  q?: string
  take?: number
  skip?: number
}

export type GetTagsResponse = {
  list: WithCountTagDTO[]
  total: number
  take: number
  skip: number
}

export async function getTags(params: GetTagsParams = {}) {
  const { q, take = 15, skip = 0 } = params

  return await apiRequest<GetTagsResponse>({
    url: 'admin/tag',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
      take: String(take),
      skip: String(skip),
    },
  })
}
