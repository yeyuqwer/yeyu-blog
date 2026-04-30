import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateFriendLink } from '@/lib/api/friend-link'

export function useAdminFriendLinkUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateFriendLink,
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
