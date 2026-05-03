export type FriendLinkState = 'PENDING' | 'APPROVED' | 'REJECTED'

export type FriendLinkRecord = {
  id: number
  name: string
  email: string | null
  description: string
  avatarUrl: string
  siteUrl: string
  state: FriendLinkState
  createdAt: string
  updatedAt: string
}
