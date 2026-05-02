import { requireAdmin } from '@/lib/core/auth/guard'
import { withResponse } from '@/lib/infra/http/with-response'
import { getAdminPendingCount } from './get-admin-pending-count'

export const GET = withResponse(async () => {
  await requireAdmin()

  return await getAdminPendingCount()
})
