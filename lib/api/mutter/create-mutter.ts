import type { MutterRecord } from './get-mutters'
import { apiRequest } from '@/lib/infra/http/ky'

export type CreateMutterParams = {
  content: string
  isPublished?: boolean
}

export type CreateMutterResponse = {
  message: string
  data: MutterRecord
}

export async function createMutter(params: CreateMutterParams) {
  return await apiRequest<CreateMutterResponse>({
    url: 'admin/mutter',
    method: 'POST',
    json: params,
  })
}
