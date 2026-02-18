import type { TagOptionRecord, UpdateTagNameDTO } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type UpdateTagResponse = {
  message: string
  data: TagOptionRecord
}

export async function updateTag(params: UpdateTagNameDTO) {
  return await apiRequest<UpdateTagResponse>({
    url: 'admin/tag',
    method: 'PATCH',
    json: params,
  })
}
