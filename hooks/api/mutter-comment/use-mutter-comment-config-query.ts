import { useQuery } from '@tanstack/react-query'
import { getMutterCommentConfig } from '@/lib/api/mutter-comment'

export function useMutterCommentConfigQuery() {
  return useQuery({
    queryKey: ['mutter-comment-config'],
    queryFn: getMutterCommentConfig,
    staleTime: 1000 * 30,
  })
}
