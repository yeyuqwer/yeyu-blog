import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { createFriendLink } from '@/lib/api/friend-link'

export function useFriendLinkMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFriendLink,
    onSuccess: async data => {
      sileo.success({ title: data.message })
      await queryClient.invalidateQueries({
        queryKey: ['admin-friend-link-list'],
      })
    },
    onError: error => {
      sileo.error({ title: error.message })
    },
  })
}
