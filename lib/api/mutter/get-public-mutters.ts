import { apiRequest } from '@/lib/infra/http/ky'

export type PublicMutterRecord = {
  id: number
  content: string
  likeCount: number
  createdAt: string
  commentCount: number
}

export type GetPublicMuttersResponse = {
  list: PublicMutterRecord[]
  total: number
  take: number
  skip: number
}

export type GetPublicMuttersParams = {
  q?: string
  take?: number
  skip?: number
}

export async function getPublicMutters(params: GetPublicMuttersParams = {}) {
  const { q, take = 20, skip = 0 } = params

  const query = {
    q: q?.trim().length ? q.trim() : undefined,
    take: String(take),
    skip: String(skip),
  }

  return await apiRequest<GetPublicMuttersResponse>({
    url: 'mutter',
    method: 'GET',
    searchParams: query,
  })
}
