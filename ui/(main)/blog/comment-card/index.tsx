'use client'

import type { ComponentProps } from 'react'
import type { CommentCardView } from './type'
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react'
import { cn } from '@/lib/utils/common/shadcn'
import { MainConfirmModal } from '@/ui/components/modal/main/main-confirm-modal'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
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
    deletingComment,
    deletingCommentId,
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
    onLoginClick: openLoginModal,
  }
  const nextSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
  const SortIcon = sortOrder === 'asc' ? ArrowUpNarrowWide : ArrowDownNarrowWide

  return (
    <>
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

        <section className="mt-6 min-h-24">
          {total != null && total > 1 ? (
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                className="inline-flex h-8 items-center gap-2 rounded-lg bg-black px-2.5 text-xs font-medium text-white shadow-[0_6px_16px_rgba(0,0,0,0.16)] transition-colors hover:bg-zinc-800 hover:text-white focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:outline-none dark:bg-white dark:text-black dark:shadow-[0_6px_16px_rgba(0,0,0,0.28)] dark:hover:bg-zinc-200 dark:hover:text-black dark:focus-visible:ring-white/30"
                aria-label={translations.comments.switchSortOrder[nextSortOrder]}
                onClick={() => {
                  setSortOrder(nextSortOrder)
                }}
              >
                <SortIcon className="size-3.5" />
                <span>{translations.comments.sortOrder[sortOrder]}</span>
              </button>
            </div>
          ) : null}

          <CommentList
            commentTree={commentTree}
            isPending={isCommentPending}
            view={commentCardView}
          />
        </section>
      </section>

      <MainConfirmModal
        open={deletingCommentId != null}
        onClose={() => {
          setDeletingCommentId(null)
        }}
        onConfirm={confirmDeleteComment}
        title={translations.comments.deleteTitle}
        description={translations.comments.deleteDescription}
        isPending={isDeletingComment}
      >
        {deletingComment != null ? (
          <div className="px-1 py-2 text-sm text-black dark:text-white">
            <p className="font-medium">
              {deletingComment.user?.name ?? deletingComment.authorName}
            </p>
            <p className="mt-2 line-clamp-3 text-xs whitespace-pre-wrap text-black/60 dark:text-white/60">
              {deletingComment.content}
            </p>
          </div>
        ) : null}
      </MainConfirmModal>
    </>
  )
}
