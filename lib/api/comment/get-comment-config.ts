import { apiRequest } from '@/lib/infra/http/ky'

export type CommentConfig = {
  id: number
  autoApproveEmailUsers: boolean
  autoApproveWalletUsers: boolean
  createdAt: string
  updatedAt: string
}

export type GetCommentConfigResponse = {
  data: CommentConfig
}

export async function getCommentConfig() {
  return await apiRequest<GetCommentConfigResponse>({
    url: 'admin/comment/config',
    method: 'GET',
  })
}
