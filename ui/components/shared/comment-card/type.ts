import type { Address } from 'viem'
import type { CommentParent, PublicCommentRecord } from '@/lib/api/comment'

export type CommentTreeNode = PublicCommentRecord & {
  children: CommentTreeNode[]
}

export type CommentAuthorLike = Pick<
  CommentParent,
  'authorName' | 'authorImage' | 'isAdmin' | 'user'
>

export type SessionAvatarProps = {
  isAdminUser: boolean
  isWalletUser: boolean
  sessionAvatar?: string
  sessionAddress?: Address
}
