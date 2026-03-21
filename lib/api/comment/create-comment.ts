import type { PublicCommentRecord } from './get-public-comments'
import type { CommentTargetType } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type CreateCommentParams = {
  targetType: CommentTargetType
  targetId: number
  content: string
}

export type CreateCommentResponse = {
  message: string
  data: PublicCommentRecord
}

export async function createComment(params: CreateCommentParams) {
  return await apiRequest<CreateCommentResponse>({
    url: 'comment',
    method: 'POST',
    json: params,
  })
}
