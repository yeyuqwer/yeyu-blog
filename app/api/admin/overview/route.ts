import { requireAdmin } from '@/lib/core/auth/guard'
import { withResponse } from '@/lib/infra/http/with-response'
import { getAdminOverviewStats } from './get-admin-overview-stats'

export const GET = withResponse(async () => {
  await requireAdmin()

  return await getAdminOverviewStats()
})
