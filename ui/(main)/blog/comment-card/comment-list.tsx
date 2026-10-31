import type { CommentCardView, CommentTreeNode } from './type'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import Loading from '@/ui/components/shared/loading'
import { CommentThreadItem } from './comment-thread-item'

export function CommentList({
  commentTree,
  isPending,
  view,
}: {
  commentTree: CommentTreeNode[]
  isPending: boolean
  view: CommentCardView
}) {
  const translations = useTranslations()

  if (isPending) {
    return (
      <div className="flex min-h-28 items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (commentTree.length === 0) {
    return (
      <div className="bg-theme-surface/30 rounded-lg border border-dashed border-black/15 px-4 py-10 text-center text-sm text-black/55 dark:border-white/15 dark:text-white/55">
        {translations.comments.empty}
      </div>
    )
  }

  return (
    <ul className="space-y-6">
      {commentTree.map(comment => (
        <CommentThreadItem key={comment.id} comment={comment} depth={0} view={view} />
      ))}
    </ul>
  )
}
