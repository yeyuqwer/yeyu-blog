import type { CreateTagDTO, TagOptionRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type CreateTagResponse = {
  message: string
  data: TagOptionRecord
}

export async function createTag(params: CreateTagDTO) {
  return await apiRequest<CreateTagResponse>({
    url: 'admin/tag',
    method: 'POST',
    json: params,
  })
}
