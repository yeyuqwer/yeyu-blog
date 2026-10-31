import type { CommentCardView, CommentTreeNode } from './type'
import { LoaderCircle } from 'lucide-react'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
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
      <div
        role="status"
        aria-label={translations.common.pending}
        className="flex min-h-24 items-center justify-center text-black/40 dark:text-white/40"
      >
        <LoaderCircle aria-hidden className="size-4 motion-safe:animate-spin" />
      </div>
    )
  }

  if (commentTree.length === 0) {
    return (
      <p className="py-4 text-sm text-black/50 dark:text-white/50">
        <LanguageText>{translations.comments.noComments}</LanguageText>
      </p>
    )
  }

  return (
    <ul className="divide-y divide-black/8 dark:divide-white/8">
      {commentTree.map(comment => (
        <CommentThreadItem key={comment.id} comment={comment} depth={0} view={view} />
      ))}
    </ul>
  )
}
