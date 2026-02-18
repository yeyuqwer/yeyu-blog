import type { EchoRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetEchosParams = {
  q?: string
}

export async function getEchos(params: GetEchosParams = {}) {
  const { q } = params

  return await apiRequest<EchoRecord[]>({
    url: 'admin/echo',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
    },
  })
}
