import type { PublicMutterCommentRecord } from './get-public-mutter-comments'
import { apiRequest } from '@/lib/infra/http/ky'

export type CreateMutterCommentParams = {
  mutterId: number
  content: string
}

export type CreateMutterCommentResponse = {
  message: string
  data: PublicMutterCommentRecord
}

export async function createMutterComment(params: CreateMutterCommentParams) {
  return await apiRequest<CreateMutterCommentResponse>({
    url: 'mutter/comment',
    method: 'POST',
    json: params,
  })
}
