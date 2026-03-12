import { apiRequest } from '@/lib/infra/http/ky'

export type MutterCommentConfig = {
  id: number
  autoApproveEmailUsers: boolean
  autoApproveWalletUsers: boolean
  createdAt: string
  updatedAt: string
}

export type GetMutterCommentConfigResponse = {
  data: MutterCommentConfig
}

export async function getMutterCommentConfig() {
  return await apiRequest<GetMutterCommentConfigResponse>({
    url: 'admin/mutter/config',
    method: 'GET',
  })
}
