import { apiRequest } from '@/lib/infra/http/ky'

export type DeleteMutterParams = {
  id: number
}

export type DeleteMutterResponse = {
  message: string
  id: number
}

export async function deleteMutter(params: DeleteMutterParams) {
  const { id } = params

  return await apiRequest<DeleteMutterResponse>({
    url: 'admin/mutter',
    method: 'DELETE',
    searchParams: {
      id: String(id),
    },
  })
}
