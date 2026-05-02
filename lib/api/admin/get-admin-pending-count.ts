import { apiRequest } from '@/lib/infra/http/ky'

export type AdminPendingCount = {
  siteCommentPendingCount: number
  mutterCommentPendingCount: number
  commentPendingCount: number
  friendLinkPendingCount: number
  pendingCount: number
}

export async function getAdminPendingCount() {
  return await apiRequest<AdminPendingCount>({
    url: 'admin/pending-count',
    method: 'GET',
  })
}
