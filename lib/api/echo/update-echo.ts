import type { EchoRecord, UpdateEchoParams } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type UpdateEchoResponse = {
  message: string
  data: EchoRecord
}

export async function updateEcho(params: UpdateEchoParams) {
  return await apiRequest<UpdateEchoResponse>({
    url: 'admin/echo',
    method: 'PATCH',
    json: params,
  })
}
