'use client'

import type { ComponentProps } from 'react'
import type { CommentTargetType } from '@/lib/api/comment'
import { cn } from '@/lib/utils/common/shadcn'
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
    commentContent,
    setCommentContent,
    replyContent,
    setReplyContent,
    activeReplyCommentId,
    isLoggedIn,
    isCommentPending,
    isCreatingComment,
    sessionUserId,
    sessionAvatarProps,
    openLoginModal,
    submitRootComment,
    handleReplyClick,
    cancelReply,
    submitReply,
  } = useCommentCard({ articleId, articleType })

  return (
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
        <CommentList
          isPending={isCommentPending}
          commentTree={commentTree}
          sessionUserId={sessionUserId}
          isLoggedIn={isLoggedIn}
          activeReplyCommentId={activeReplyCommentId}
          replyContent={replyContent}
          isCreatingComment={isCreatingComment}
          sessionAvatarProps={sessionAvatarProps}
          onReplyClick={handleReplyClick}
          onReplyCancel={cancelReply}
          onReplyContentChange={setReplyContent}
          onReplySubmit={submitReply}
        />
      </section>
    </section>
  )
}
