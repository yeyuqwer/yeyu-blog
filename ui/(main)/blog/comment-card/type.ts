import type { PublicCommentRecord } from '@/lib/api/comment/get-public-comments'
import type { CommentParent } from '@/lib/api/comment/type'

export type CommentTreeNode = PublicCommentRecord & {
  children: CommentTreeNode[]
}

export type CommentAuthorLike = Pick<
  CommentParent,
  'authorName' | 'authorImage' | 'isAdmin' | 'user'
>

export type CommentCardView = {
  commentReferenceTime: number
  sessionUserId?: string
  isLoggedIn: boolean
  isCreatingComment: boolean
  isDeletingComment: boolean
  onReplySubmit: (commentId: number) => void
  onDeleteClick: (commentId: number | null) => void
  onDeleteConfirm: () => void
  onLoginClick: () => void
}
