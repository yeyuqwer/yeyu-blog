import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNote } from '@/lib/api/note'

export function useNoteUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateNote,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['note-list'] }),
        queryClient.invalidateQueries({ queryKey: ['public-note-list'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
      ])
    },
  })
}
