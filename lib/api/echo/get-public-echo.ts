import type { PublicEchoCardData } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export async function getPublicEcho() {
  return await apiRequest<PublicEchoCardData>({
    url: 'echo',
    method: 'GET',
    cache: 'no-store',
  })
}
