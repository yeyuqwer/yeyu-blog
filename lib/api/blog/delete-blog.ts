import { apiRequest } from '@/lib/infra/http/ky'

export type DeleteBlogParams = {
  id: number
}

export type DeleteBlogResponse = {
  message: string
  id: number
}

export async function deleteBlog(params: DeleteBlogParams) {
  const { id } = params

  return await apiRequest<DeleteBlogResponse>({
    url: 'admin/blog',
    method: 'DELETE',
    searchParams: {
      id: String(id),
    },
  })
}
