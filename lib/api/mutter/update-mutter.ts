import type { MutterRecord } from './get-mutters'
import { apiRequest } from '@/lib/infra/http/ky'

export type UpdateMutterParams = {
  id: number
  content?: string
  isPublished?: boolean
}

export type UpdateMutterResponse = {
  message: string
  data: MutterRecord
}

export async function updateMutter(params: UpdateMutterParams) {
  return await apiRequest<UpdateMutterResponse>({
    url: 'admin/mutter',
    method: 'PATCH',
    json: params,
  })
}
