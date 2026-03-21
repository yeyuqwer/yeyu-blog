import type { CommentConfig } from './get-comment-config'
import { apiRequest } from '@/lib/infra/http/ky'

export type UpdateCommentConfigParams = Pick<
  CommentConfig,
  'autoApproveEmailUsers' | 'autoApproveWalletUsers'
>

export async function updateCommentConfig(params: UpdateCommentConfigParams) {
  return await apiRequest({
    url: 'admin/comment/config',
    method: 'PATCH',
    json: params,
  })
}
