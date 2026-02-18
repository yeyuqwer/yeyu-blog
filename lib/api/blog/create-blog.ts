import type { CreateBlogDTO, RawBlogRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type CreateBlogResponse = {
  message: string
  data: RawBlogRecord
}

export async function createBlog(params: CreateBlogDTO) {
  return await apiRequest<CreateBlogResponse>({
    url: 'admin/blog',
    method: 'POST',
    json: params,
  })
}
