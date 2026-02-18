import type { RawBlogRecord, UpdateBlogParams } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type UpdateBlogResponse = {
  message: string
  data: RawBlogRecord
}

export async function updateBlog(params: UpdateBlogParams) {
  return await apiRequest<UpdateBlogResponse>({
    url: 'admin/blog',
    method: 'PATCH',
    json: params,
  })
}
