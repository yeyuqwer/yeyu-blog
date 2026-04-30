import type { FriendLinkRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type PublicFriendLinkRecord = FriendLinkRecord

export type GetPublicFriendLinksResponse = {
  list: PublicFriendLinkRecord[]
  total: number
  take: number
  skip: number
}

export type GetPublicFriendLinksParams = {
  take?: number
  skip?: number
}

export async function getPublicFriendLinks(params: GetPublicFriendLinksParams = {}) {
  const { take = 100, skip = 0 } = params

  return await apiRequest<GetPublicFriendLinksResponse>({
    url: 'friend-link',
    method: 'GET',
    searchParams: {
      take: String(take),
      skip: String(skip),
    },
  })
}
