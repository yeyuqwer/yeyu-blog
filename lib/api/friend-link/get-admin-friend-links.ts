import type { FriendLinkRecord, FriendLinkState } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type AdminFriendLinkRecord = FriendLinkRecord

export type GetAdminFriendLinksResponse = {
  list: AdminFriendLinkRecord[]
  total: number
  take: number
  skip: number
}

export type GetAdminFriendLinksParams = {
  q?: string
  state?: FriendLinkState
  take?: number
  skip?: number
}

export async function getAdminFriendLinks(params: GetAdminFriendLinksParams = {}) {
  const { q, state, take = 20, skip = 0 } = params

  return await apiRequest<GetAdminFriendLinksResponse>({
    url: 'admin/friend-link',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
      state,
      take: String(take),
      skip: String(skip),
    },
  })
}
