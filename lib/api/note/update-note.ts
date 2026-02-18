import type { RawNoteRecord, UpdateNoteParams } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type UpdateNoteResponse = {
  message: string
  data: RawNoteRecord
}

export async function updateNote(params: UpdateNoteParams) {
  return await apiRequest<UpdateNoteResponse>({
    url: 'admin/note',
    method: 'PATCH',
    json: params,
  })
}
