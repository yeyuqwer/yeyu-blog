import type { CreateEchoDTO, EchoRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type CreateEchoResponse = {
  message: string
  data: EchoRecord
}

export async function createEcho(params: CreateEchoDTO) {
  return await apiRequest<CreateEchoResponse>({
    url: 'admin/echo',
    method: 'POST',
    json: params,
  })
}
