import type { CommentParent, CommentState, CommentTargetType, CommentUser } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type PublicCommentRecord = {
  id: number
  targetType: CommentTargetType
  targetId: number
  parentId: number | null
  parent: CommentParent | null
  userId: string | null
  isAdmin: boolean
  authorName: string
  authorImage: string | null
  content: string
  state: CommentState
  createdAt: string
  updatedAt: string
  user: CommentUser | null
}

export type GetPublicCommentsResponse = {
  list: PublicCommentRecord[]
  total: number
  take: number
  skip: number
}

export type GetPublicCommentsParams = {
  targetType: CommentTargetType
  targetId: number
  take?: number
  skip?: number
}

export async function getPublicComments(params: GetPublicCommentsParams) {
  const { targetType, targetId, take = 20, skip = 0 } = params

  return await apiRequest<GetPublicCommentsResponse>({
    url: 'comment',
    method: 'GET',
    searchParams: {
      targetType,
      targetId: String(targetId),
      take: String(take),
      skip: String(skip),
    },
  })
}
