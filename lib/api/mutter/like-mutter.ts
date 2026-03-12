import { apiRequest } from '@/lib/infra/http/ky'

export type LikeMutterParams = {
  mutterId: number
}

export type LikeMutterResponse = {
  message: string
  data: {
    id: number
    likeCount: number
  }
}

export async function likeMutter(params: LikeMutterParams) {
  return await apiRequest<LikeMutterResponse>({
    url: 'mutter/like',
    method: 'POST',
    json: params,
  })
}
