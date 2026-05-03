import { apiRequest } from '@/lib/infra/http/ky'

export type MutterCommentState = 'PENDING' | 'APPROVED' | 'REJECTED'

export type AdminMutterCommentRecord = {
  id: number
  mutterId: number
  userId: string | null
  authorName: string
  authorImage: string | null
  content: string
  isDeleted: boolean
  state: MutterCommentState
  createdAt: string
  updatedAt: string
  mutter: {
    id: number
    content: string
    isPublished: boolean
  }
  user: {
    id: string
    name: string
    email: string
    image: string | null
  } | null
}

export type GetAdminMutterCommentsResponse = {
  list: AdminMutterCommentRecord[]
  total: number
  take: number
  skip: number
}

export type GetAdminMutterCommentsParams = {
  q?: string
  mutterId?: number
  state?: MutterCommentState
  isDeleted?: boolean
  take?: number
  skip?: number
}

export async function getAdminMutterComments(params: GetAdminMutterCommentsParams = {}) {
  const { q, mutterId, state, isDeleted, take = 20, skip = 0 } = params

  return await apiRequest<GetAdminMutterCommentsResponse>({
    url: 'admin/mutter/comment',
    method: 'GET',
    searchParams: {
      q: q?.trim().length ? q.trim() : undefined,
      mutterId: mutterId != null ? String(mutterId) : undefined,
      state,
      isDeleted: isDeleted != null ? String(isDeleted) : undefined,
      take: String(take),
      skip: String(skip),
    },
  })
}
