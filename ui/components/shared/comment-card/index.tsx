'use client'

import type { ComponentProps } from 'react'
import type { CommentTargetType } from '@/lib/api/comment'
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react'
import { cn } from '@/lib/utils/common/shadcn'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'
import { CommentCardHeader } from './comment-card-header'
import { CommentComposer } from './comment-composer'
import { CommentList } from './comment-list'
import { CommentLoginPrompt } from './comment-login-prompt'
import { useCommentCard } from './use-comment-card'

export default function CommentCard({
  articleId,
  articleType,
  className,
}: ComponentProps<'section'> & {
  articleId: number
  articleType: CommentTargetType
}) {
  const {
    total,
    commentTree,
    sortOrder,
    setSortOrder,
    commentContent,
    setCommentContent,
    replyContent,
    setReplyContent,
    activeReplyCommentId,
    isLoggedIn,
    isCommentPending,
    isCreatingComment,
    isDeletingComment,
    sessionUserId,
    sessionAvatarProps,
    deletingComment,
    setDeletingComment,
    openLoginModal,
    submitRootComment,
    handleReplyClick,
    cancelReply,
    submitReply,
    confirmDeleteComment,
  } = useCommentCard({ articleId, articleType })
  const nextSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
  const SortIcon = sortOrder === 'asc' ? ArrowUpNarrowWide : ArrowDownNarrowWide

  return (
    <>
      <section id="comments" className={cn('py-2 sm:py-4', className)}>
        <CommentCardHeader total={total} />

        <section className="mt-5 border-zinc-200/70 border-b pb-5 dark:border-zinc-800/70">
          {isLoggedIn ? (
            <CommentComposer
              value={commentContent}
              isSubmitting={isCreatingComment}
              sessionAvatarProps={sessionAvatarProps}
              placeholder="写下你的评论..."
              submitLabel="发布"
              helperText="Web3 钱包登录用户评论提交后可能需要审核。"
              onChange={setCommentContent}
              onSubmit={submitRootComment}
            />
          ) : (
            <CommentLoginPrompt onLoginClick={openLoginModal} />
          )}
        </section>

        <section className="mt-6 min-h-24">
          {total != null && total > 1 ? (
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-theme-indicator dark:text-zinc-400 dark:hover:text-theme-indicator"
                aria-label={`切换为${nextSortOrder === 'asc' ? '正序' : '倒序'}`}
                onClick={() => {
                  setSortOrder(nextSortOrder)
                }}
              >
                <SortIcon className="size-3.5" />
                <span>{`按时间${sortOrder === 'asc' ? '正序' : '倒序'}`}</span>
              </button>
            </div>
          ) : null}

          <CommentList
            isPending={isCommentPending}
            commentTree={commentTree}
            sessionUserId={sessionUserId}
            isLoggedIn={isLoggedIn}
            activeReplyCommentId={activeReplyCommentId}
            replyContent={replyContent}
            isCreatingComment={isCreatingComment}
            isDeletingComment={isDeletingComment}
            sessionAvatarProps={sessionAvatarProps}
            onReplyClick={handleReplyClick}
            onReplyCancel={cancelReply}
            onReplyContentChange={setReplyContent}
            onReplySubmit={submitReply}
            onDeleteClick={setDeletingComment}
          />
        </section>
      </section>

      <ConfirmDialog
        open={deletingComment != null}
        onClose={() => {
          setDeletingComment(null)
        }}
        onConfirm={confirmDeleteComment}
        title="确定要删除这条评论吗？"
        description="该操作不可撤销。"
        isPending={isDeletingComment}
      >
        {deletingComment != null ? (
          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            <p className="font-medium">
              {deletingComment.user?.name ?? deletingComment.authorName}
            </p>
            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-muted-foreground text-xs">
              {deletingComment.content}
            </p>
          </div>
        ) : null}
      </ConfirmDialog>
    </>
  )
}
