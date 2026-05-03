import type { FriendLinkRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type CreateFriendLinkParams = {
  name: string
  email?: string
  description: string
  avatarUrl: string
  siteUrl: string
}

export type CreateFriendLinkResponse = {
  message: string
  data: FriendLinkRecord
}

export async function createFriendLink(params: CreateFriendLinkParams) {
  return await apiRequest<CreateFriendLinkResponse>({
    url: 'friend-link',
    method: 'POST',
    json: params,
  })
}
