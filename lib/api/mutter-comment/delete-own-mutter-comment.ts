import { apiRequest } from '@/lib/infra/http/ky'

export async function deleteOwnMutterComment(params: { id: number }) {
  const { id } = params

  return await apiRequest<{ message: string; id: number; mutterId: number }>({
    url: 'mutter/comment',
    method: 'DELETE',
    searchParams: {
      id: String(id),
    },
  })
}
