import { apiRequest } from '@/lib/infra/http/ky'

export type PublicMutterCommentRecord = {
  id: number
  mutterId: number
  userId: string | null
  isAdmin: boolean
  authorName: string
  authorImage: string | null
  content: string
  isDeleted: boolean
  state: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    image: string | null
  } | null
}

export type GetPublicMutterCommentsResponse = {
  list: PublicMutterCommentRecord[]
  total: number
  take: number
  skip: number
}

export type GetPublicMutterCommentsParams = {
  mutterId: number
  take?: number
  skip?: number
}

export async function getPublicMutterComments(params: GetPublicMutterCommentsParams) {
  const { mutterId, take = 20, skip = 0 } = params

  return await apiRequest<GetPublicMutterCommentsResponse>({
    url: 'mutter/comment',
    method: 'GET',
    searchParams: {
      mutterId: String(mutterId),
      take: String(take),
      skip: String(skip),
    },
  })
}
