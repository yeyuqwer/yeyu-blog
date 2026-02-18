import { apiRequest } from '@/lib/infra/http/ky'

export type DeleteEchoParams = {
  id: number
}

export type DeleteEchoResponse = {
  message: string
  id: number
}

export async function deleteEcho(params: DeleteEchoParams) {
  const { id } = params

  return await apiRequest<DeleteEchoResponse>({
    url: 'admin/echo',
    method: 'DELETE',
    searchParams: {
      id: String(id),
    },
  })
}
