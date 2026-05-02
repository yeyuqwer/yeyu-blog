import type { EchoRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetEchosParams = {
  q?: string
  take?: number
  skip?: number
}

export type GetEchosResponse = {
  list: EchoRecord[]
  total: number
  take: number
  skip: number
}

export async function getEchos(params: GetEchosParams = {}) {
  const { q, take = 15, skip = 0 } = params

  return await apiRequest<GetEchosResponse>({
    url: 'admin/echo',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
      take: String(take),
      skip: String(skip),
    },
  })
}
