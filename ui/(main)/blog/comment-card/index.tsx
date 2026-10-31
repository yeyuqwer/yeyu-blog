'use client'

import type { ComponentProps } from 'react'
import type { CommentCardView } from './type'
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react'
import { cn } from '@/lib/utils/common/shadcn'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
import { CommentComposer } from './comment-composer'
import { CommentList } from './comment-list'
import { CommentLoginPrompt } from './comment-login-prompt'
import { useCommentCard } from './use-comment-card'

export default function CommentCard({
  articleId,
  className,
}: ComponentProps<'section'> & {
  articleId: number
}) {
  const translations = useTranslations()
  const {
    total,
    commentTree,
    commentReferenceTime,
    sortOrder,
    setSortOrder,
    commentContent,
    setCommentContent,
    isLoggedIn,
    sessionUserId,
    isCommentPending,
    isCreatingComment,
    isDeletingComment,
    setDeletingCommentId,
    openLoginModal,
    submitRootComment,
    submitReply,
    confirmDeleteComment,
  } = useCommentCard({ articleId })
  const commentCardView: CommentCardView = {
    commentReferenceTime,
    sessionUserId,
    isLoggedIn,
    isCreatingComment,
    isDeletingComment,
    onReplySubmit: submitReply,
    onDeleteClick: setDeletingCommentId,
    onDeleteConfirm: confirmDeleteComment,
    onLoginClick: openLoginModal,
  }
  const nextSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
  const SortIcon = sortOrder === 'asc' ? ArrowUpNarrowWide : ArrowDownNarrowWide

  return (
    <section className={cn('py-8 sm:py-10', className)}>
      {isLoggedIn ? (
        <CommentComposer
          value={commentContent}
          isSubmitting={isCreatingComment}
          placeholder={translations.comments.placeholder}
          submitLabel={translations.comments.publish}
          onChange={setCommentContent}
          onSubmit={submitRootComment}
        />
      ) : (
        <CommentLoginPrompt onLoginClick={openLoginModal} />
      )}

      <section className="mt-8 min-h-24">
        <header className="mb-5 flex items-center justify-between gap-3">
          <h2 className="flex items-baseline gap-2 text-sm font-medium text-black/80 dark:text-white/80">
            <LanguageText>{translations.comments.title}</LanguageText>
            {total != null && total > 0 && (
              <span className="font-mono text-xs font-normal text-black/45 dark:text-white/45">
                {total}
              </span>
            )}
          </h2>
          {total != null && total > 1 ? (
            <button
              type="button"
              className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[11px] text-black/55 transition-colors hover:bg-black/5 hover:text-black focus-visible:ring-2 focus-visible:ring-black/15 focus-visible:outline-none motion-reduce:transition-none dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white dark:focus-visible:ring-white/20"
              aria-label={translations.comments.switchSortOrder[nextSortOrder]}
              onClick={() => {
                setSortOrder(nextSortOrder)
              }}
            >
              <SortIcon aria-hidden className="size-3.5" />
              <LanguageText>{translations.comments.sortOrder[sortOrder]}</LanguageText>
            </button>
          ) : null}
        </header>

        <CommentList
          commentTree={commentTree}
          isPending={isCommentPending}
          view={commentCardView}
        />
      </section>
    </section>
  )
}
