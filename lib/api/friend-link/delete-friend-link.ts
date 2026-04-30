import { apiRequest } from '@/lib/infra/http/ky'

export type DeleteFriendLinkParams = {
  id: number
}

export async function deleteFriendLink(params: DeleteFriendLinkParams) {
  return await apiRequest({
    url: 'admin/friend-link',
    method: 'DELETE',
    searchParams: {
      id: String(params.id),
    },
  })
}
