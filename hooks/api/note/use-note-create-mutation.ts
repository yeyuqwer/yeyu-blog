import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from '@/lib/api/note'

export function useNoteCreateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['note-list'] }),
        queryClient.invalidateQueries({ queryKey: ['public-note-list'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
      ])
    },
  })
}
