import type { MutterCommentConfig } from './get-mutter-comment-config'
import { apiRequest } from '@/lib/infra/http/ky'

export type UpdateMutterCommentConfigParams = {
  autoApproveEmailUsers: boolean
  autoApproveWalletUsers: boolean
}

export type UpdateMutterCommentConfigResponse = {
  message: string
  data: MutterCommentConfig
}

export async function updateMutterCommentConfig(params: UpdateMutterCommentConfigParams) {
  return await apiRequest<UpdateMutterCommentConfigResponse>({
    url: 'admin/mutter/config',
    method: 'PATCH',
    json: params,
  })
}
