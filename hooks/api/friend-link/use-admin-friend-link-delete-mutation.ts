import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFriendLink } from '@/lib/api/friend-link'

export function useAdminFriendLinkDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFriendLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin-friend-link-list'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['public-friend-link-list'],
      })
    },
  })
}
