import { apiRequest } from '@/lib/infra/http/ky'

export type DeleteMutterCommentParams = {
  id: number
}

export type DeleteMutterCommentResponse = {
  message: string
  id: number
}

export async function deleteMutterComment(params: DeleteMutterCommentParams) {
  const { id } = params

  return await apiRequest<DeleteMutterCommentResponse>({
    url: 'admin/mutter/comment',
    method: 'DELETE',
    searchParams: {
      id: String(id),
    },
  })
}
