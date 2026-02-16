import { apiRequest } from '@/lib/infra/http/ky'

export type MutterRecord = {
  id: number
  content: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type GetMuttersResponse = {
  list: MutterRecord[]
  total: number
  take: number
  skip: number
}

export type GetMuttersParams = {
  q?: string
  isPublished?: boolean
  take?: number
  skip?: number
}

export async function getMutters(params: GetMuttersParams = {}) {
  const { q, isPublished, take = 20, skip = 0 } = params

  const query = {
    q: q?.trim().length ? q.trim() : undefined,
    isPublished: isPublished != null ? String(isPublished) : undefined,
    take: String(take),
    skip: String(skip),
  }

  return await apiRequest<GetMuttersResponse>({
    url: 'admin/mutter',
    method: 'GET',
    searchParams: query,
  })
}
