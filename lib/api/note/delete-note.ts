import { apiRequest } from '@/lib/infra/http/ky'

export type DeleteNoteParams = {
  id: number
}

export type DeleteNoteResponse = {
  message: string
  id: number
}

export async function deleteNote(params: DeleteNoteParams) {
  const { id } = params

  return await apiRequest<DeleteNoteResponse>({
    url: 'admin/note',
    method: 'DELETE',
    searchParams: {
      id: String(id),
    },
  })
}
