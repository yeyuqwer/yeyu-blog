import { apiRequest } from '@/lib/infra/http/ky'

export type DeleteCommentParams = {
  id: number
}

export async function deleteComment(params: DeleteCommentParams) {
  return await apiRequest({
    url: 'admin/comment',
    method: 'DELETE',
    searchParams: {
      id: String(params.id),
    },
  })
}
