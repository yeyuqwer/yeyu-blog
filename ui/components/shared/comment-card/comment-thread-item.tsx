import type { CommentTreeNode, SessionAvatarProps } from './type'
import { CornerUpLeft, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils/common/shadcn'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/time'
import { Button } from '@/ui/shadcn/button'
import { CommentAuthorAvatar } from './comment-avatar'
import { CommentComposer } from './comment-composer'
import { CommentMarkdownContent } from './comment-markdown-content'
import { formatCommentDisplayName, getCommentDisplayName } from './helper'

export function CommentThreadItem({
  comment,
  depth,
  sessionUserId,
  isLoggedIn,
  activeReplyCommentId,
  replyContent,
  isCreatingComment,
  isDeletingComment,
  sessionAvatarProps,
  onReplyClick,
  onReplyCancel,
  onReplyContentChange,
  onReplySubmit,
  onDeleteClick,
}: {
  comment: CommentTreeNode
  depth: number
  sessionUserId?: string
  isLoggedIn: boolean
  activeReplyCommentId: number | null
  replyContent: string
  isCreatingComment: boolean
  isDeletingComment: boolean
  sessionAvatarProps: SessionAvatarProps
  onReplyClick: (commentId: number) => void
  onReplyCancel: () => void
  onReplyContentChange: (value: string) => void
  onReplySubmit: (commentId: number) => void
  onDeleteClick: (comment: CommentTreeNode) => void
}) {
  const isDeletedComment = comment.isDeleted
  const commentCreatedAt = new Date(comment.createdAt)
  const absoluteTime = prettyDateTime(commentCreatedAt)
  const shouldShowRelativeTime =
    Math.abs(Date.now() - commentCreatedAt.getTime()) <= 7 * 24 * 60 * 60 * 1000
  const displayName = getCommentDisplayName(comment)
  const formattedDisplayName = formatCommentDisplayName(displayName)
  const isCurrentUserComment = sessionUserId != null && comment.userId === sessionUserId
  const canDeleteComment = !isDeletedComment && isCurrentUserComment
  const isReplyEditorOpen = !isDeletedComment && activeReplyCommentId === comment.id
  const parentDisplayName =
    comment.parent == null ? null : formatCommentDisplayName(getCommentDisplayName(comment.parent))

  return (
    <li
      className={cn(
        'group',
        depth === 0 && 'border-zinc-200/70 border-b pb-5 last:border-b-0 dark:border-zinc-800/70',
        depth > 0 && 'ml-5 border-zinc-200/80 border-l pl-4 sm:ml-7 dark:border-zinc-800',
      )}
    >
      <div className="flex items-start gap-3.5">
        <CommentAuthorAvatar comment={comment} />

        <div className="min-w-0 flex-1">
          <article>
            <header className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={
                      comment.isAdmin
                        ? 'max-w-40 truncate font-medium text-theme-indicator'
                        : 'max-w-40 truncate font-medium text-zinc-800 dark:text-zinc-100'
                    }
                  >
                    {formattedDisplayName}
                  </span>
                  {comment.isAdmin ? (
                    <span className="rounded-full bg-theme-indicator/12 px-2 py-0.5 font-medium text-theme-indicator">
                      Admin
                    </span>
                  ) : null}
                  {isCurrentUserComment ? (
                    <span className="rounded-full bg-theme-indicator/8 px-2 py-0.5 font-medium text-theme-indicator/70">
                      You
                    </span>
                  ) : null}
                  <time
                    className="text-zinc-500 dark:text-zinc-400"
                    dateTime={commentCreatedAt.toISOString()}
                    title={absoluteTime}
                  >
                    {absoluteTime}
                  </time>
                  {shouldShowRelativeTime ? (
                    <time
                      className="text-zinc-400 dark:text-zinc-500"
                      dateTime={commentCreatedAt.toISOString()}
                      title={absoluteTime}
                    >
                      {toRelativeDate(commentCreatedAt)}
                    </time>
                  ) : null}
                  {isDeletedComment ? (
                    <span className="text-zinc-400 dark:text-zinc-500">（已删除）</span>
                  ) : null}
                </div>

                {parentDisplayName != null ? (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <CornerUpLeft className="size-3.5" />
                    <span>{`回复 ${parentDisplayName}`}</span>
                  </div>
                ) : null}
              </div>

              {!isDeletedComment ? (
                <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  {canDeleteComment ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-lg text-zinc-500 hover:text-destructive dark:text-zinc-400"
                      aria-label={`删除 ${formattedDisplayName} 的评论`}
                      disabled={isDeletingComment}
                      onClick={() => {
                        onDeleteClick(comment)
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    aria-label={`回复 ${formattedDisplayName}`}
                    onClick={() => {
                      onReplyClick(comment.id)
                    }}
                  >
                    <CornerUpLeft className="size-3.5" />
                  </Button>
                </div>
              ) : null}
            </header>

            <div className="mt-2 text-zinc-900 dark:text-zinc-100">
              {isDeletedComment ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  <del>已删除</del>
                </p>
              ) : (
                <CommentMarkdownContent
                  content={comment.content}
                  htmlContent={comment.htmlContent}
                />
              )}
            </div>
          </article>

          {isReplyEditorOpen ? (
            <div className="mt-3 border-zinc-200/70 border-t pt-3 dark:border-zinc-800/70">
              <CommentComposer
                value={replyContent}
                autoFocus
                isSubmitting={isCreatingComment}
                sessionAvatarProps={sessionAvatarProps}
                submitLabel="回复"
                placeholder={`回复 ${formattedDisplayName}...`}
                helperText={
                  isLoggedIn
                    ? 'Web3 钱包登录用户回复提交后可能需要审核。'
                    : '登录后即可回复这条评论。'
                }
                title={`回复 ${formattedDisplayName}`}
                onChange={onReplyContentChange}
                onCancel={onReplyCancel}
                onSubmit={() => {
                  onReplySubmit(comment.id)
                }}
              />
            </div>
          ) : null}

          {comment.children.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {comment.children.map(childComment => (
                <CommentThreadItem
                  key={childComment.id}
                  comment={childComment}
                  depth={depth + 1}
                  sessionUserId={sessionUserId}
                  isLoggedIn={isLoggedIn}
                  activeReplyCommentId={activeReplyCommentId}
                  replyContent={replyContent}
                  isCreatingComment={isCreatingComment}
                  isDeletingComment={isDeletingComment}
                  sessionAvatarProps={sessionAvatarProps}
                  onReplyClick={onReplyClick}
                  onReplyCancel={onReplyCancel}
                  onReplyContentChange={onReplyContentChange}
                  onReplySubmit={onReplySubmit}
                  onDeleteClick={onDeleteClick}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  )
}
