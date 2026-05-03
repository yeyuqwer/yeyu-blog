import { apiRequest } from '@/lib/infra/http/ky'

export async function deleteOwnComment(params: { id: number }) {
  const { id } = params

  return await apiRequest<{ message: string; id: number }>({
    url: 'comment',
    method: 'DELETE',
    searchParams: {
      id: String(id),
    },
  })
}
