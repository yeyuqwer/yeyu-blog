import type { CommentState } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type UpdateCommentParams = {
  id: number
  state: CommentState
}

export type RestoreCommentParams = {
  id: number
  isDeleted: false
}

export async function updateComment(params: UpdateCommentParams) {
  return await apiRequest({
    url: 'admin/comment',
    method: 'PATCH',
    json: params,
  })
}

export async function restoreComment(params: RestoreCommentParams) {
  return await apiRequest({
    url: 'admin/comment',
    method: 'PATCH',
    json: params,
  })
}
