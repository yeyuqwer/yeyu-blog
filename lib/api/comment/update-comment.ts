import type { CommentState } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type UpdateCommentParams = {
  id: number
  state: CommentState
}

export async function updateComment(params: UpdateCommentParams) {
  return await apiRequest({
    url: 'admin/comment',
    method: 'PATCH',
    json: params,
  })
}
