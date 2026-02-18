import type { CreateNoteDTO, RawNoteRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type CreateNoteResponse = {
  message: string
  data: RawNoteRecord
}

export async function createNote(params: CreateNoteDTO) {
  return await apiRequest<CreateNoteResponse>({
    url: 'admin/note',
    method: 'POST',
    json: params,
  })
}
