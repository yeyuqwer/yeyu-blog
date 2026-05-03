import type { MutterCommentState } from './get-admin-mutter-comments'
import type { PublicMutterCommentRecord } from './get-public-mutter-comments'
import { apiRequest } from '@/lib/infra/http/ky'

export type UpdateMutterCommentParams = {
  id: number
  state: MutterCommentState
}

export type RestoreMutterCommentParams = {
  id: number
  isDeleted: false
}

export type UpdateMutterCommentResponse = {
  message: string
  data: PublicMutterCommentRecord
}

export async function updateMutterComment(params: UpdateMutterCommentParams) {
  return await apiRequest<UpdateMutterCommentResponse>({
    url: 'admin/mutter/comment',
    method: 'PATCH',
    json: params,
  })
}

export async function restoreMutterComment(params: RestoreMutterCommentParams) {
  return await apiRequest<UpdateMutterCommentResponse>({
    url: 'admin/mutter/comment',
    method: 'PATCH',
    json: params,
  })
}
