import type { FriendLinkState } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type UpdateFriendLinkParams = {
  id: number
  name?: string
  description?: string
  avatarUrl?: string
  siteUrl?: string
  state?: FriendLinkState
}

export async function updateFriendLink(params: UpdateFriendLinkParams) {
  return await apiRequest({
    url: 'admin/friend-link',
    method: 'PATCH',
    json: params,
  })
}
