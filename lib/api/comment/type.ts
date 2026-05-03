export type CommentTargetType = 'BLOG' | 'NOTE'

export type CommentState = 'PENDING' | 'APPROVED' | 'REJECTED'

export type CommentUser = {
  id: string
  name: string
  image: string | null
}

export type CommentParent = {
  id: number
  userId: string | null
  isAdmin: boolean
  authorName: string
  authorImage: string | null
  isDeleted: boolean
  user: CommentUser | null
}

export type CommentTarget = {
  id: number
  title: string
  slug: string
  isPublished: boolean
  targetType: CommentTargetType
  path: string
}
