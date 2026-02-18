import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNote } from '@/lib/api/note'

export type ToggleNotePublishParams = {
  id: number
  isPublished: boolean
}

export function useNotePublishMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isPublished }: ToggleNotePublishParams) =>
      updateNote({
        id,
        isPublished,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['note-list'] }),
        queryClient.invalidateQueries({ queryKey: ['public-note-list'] }),
      ])
    },
  })
}
