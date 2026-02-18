import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNote } from '@/lib/api/note'

export function useNoteDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['note-list'] }),
        queryClient.invalidateQueries({ queryKey: ['public-note-list'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
      ])
    },
  })
}
