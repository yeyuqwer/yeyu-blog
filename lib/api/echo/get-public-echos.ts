import type { EchoRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type GetPublicEchosParams = {
  q?: string
}

export async function getPublicEchos(params: GetPublicEchosParams = {}) {
  const { q } = params

  return await apiRequest<EchoRecord | null>({
    url: 'echo',
    method: 'GET',
    cache: 'no-store',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
    },
  })
}
