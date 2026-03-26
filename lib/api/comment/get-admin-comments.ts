import type { CommentParent, CommentState, CommentTarget, CommentTargetType } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type AdminCommentRecord = {
  id: number
  targetType: CommentTargetType
  targetId: number
  parentId: number | null
  parent: CommentParent | null
  userId: string | null
  authorName: string
  authorImage: string | null
  content: string
  state: CommentState
  createdAt: string
  updatedAt: string
  target: CommentTarget | null
  user: {
    id: string
    name: string
    email: string
    image: string | null
  } | null
}

export type GetAdminCommentsResponse = {
  list: AdminCommentRecord[]
  total: number
  take: number
  skip: number
}

export type GetAdminCommentsParams = {
  q?: string
  targetType?: CommentTargetType
  targetId?: number
  state?: CommentState
  take?: number
  skip?: number
}

export async function getAdminComments(params: GetAdminCommentsParams = {}) {
  const { q, targetType, targetId, state, take = 20, skip = 0 } = params

  return await apiRequest<GetAdminCommentsResponse>({
    url: 'admin/comment',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
      targetType,
      targetId: targetId != null ? String(targetId) : undefined,
      state,
      take: String(take),
      skip: String(skip),
    },
  })
}
