import type { CommentCardView, CommentTreeNode } from './type'
import { CornerUpLeft, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils/common/shadcn'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/common/time'
import { useCommentCardActions, useCommentCardStore } from '@/store/use-comment-card-store'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { Button } from '@/ui/shadcn/button'
import { CommentAuthorAvatar } from './comment-avatar'
import { CommentComposer } from './comment-composer'
import { CommentMarkdownContent } from './comment-markdown-content'
import { maxCommentLevels } from './constant'
import { formatCommentDisplayName, getCommentDisplayName } from './helper'

function CommentHeader({
  comment,
  commentCreatedAt,
  absoluteTime,
  shouldShowRelativeTime,
  formattedDisplayName,
  canReply,
  view,
}: {
  comment: CommentTreeNode
  commentCreatedAt: Date
  absoluteTime: string
  shouldShowRelativeTime: boolean
  formattedDisplayName: string
  canReply: boolean
  view: CommentCardView
}) {
  const translations = useTranslations()
  const { sessionUserId, isDeletingComment, isLoggedIn, onDeleteClick, onLoginClick } = view
  const { toggleReply } = useCommentCardActions()
  const isCurrentUserComment = sessionUserId != null && comment.userId === sessionUserId
  const canDeleteComment = !comment.isDeleted && isCurrentUserComment
  const parentDisplayName =
    comment.parent == null ? null : formatCommentDisplayName(getCommentDisplayName(comment.parent))
  const createdAtIso = commentCreatedAt.toISOString()

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
          <span className="max-w-40 truncate font-semibold text-black dark:text-white">
            {formattedDisplayName}
          </span>
          {comment.isAdmin ? (
            <span className="rounded-md bg-black/8 px-1.5 py-0.5 text-[11px] font-medium text-black dark:bg-white/10 dark:text-white">
              {translations.comments.admin}
            </span>
          ) : null}
          {isCurrentUserComment ? (
            <span className="rounded-md bg-black/6 px-1.5 py-0.5 text-[11px] font-medium text-black/75 dark:bg-white/8 dark:text-white/75">
              {translations.comments.you}
            </span>
          ) : null}
          <time
            className="text-[11px] text-black/50 dark:text-white/50"
            dateTime={createdAtIso}
            title={absoluteTime}
          >
            {absoluteTime}
          </time>
          {shouldShowRelativeTime ? (
            <time
              className="text-[11px] text-black/38 dark:text-white/38"
              dateTime={createdAtIso}
              title={absoluteTime}
            >
              {toRelativeDate(commentCreatedAt)}
            </time>
          ) : null}
          {comment.isDeleted ? (
            <span className="text-[11px] text-black/42 dark:text-white/42">
              {translations.comments.deletedStatus}
            </span>
          ) : null}
        </div>

        {parentDisplayName != null ? (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-black/55 dark:text-white/55">
            <CornerUpLeft className="size-3.5" />
            <span>{translations.comments.replyTo(parentDisplayName)}</span>
          </div>
        ) : null}
      </div>

      {!comment.isDeleted && (canDeleteComment || canReply) ? (
        <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
          {canDeleteComment ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="hover:bg-destructive/10 hover:text-destructive rounded-md text-black/55 dark:text-white/55"
              aria-label={translations.comments.deleteLabel(formattedDisplayName)}
              disabled={isDeletingComment}
              onClick={() => {
                onDeleteClick(comment.id)
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          ) : null}
          {canReply ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="rounded-md text-black/55 hover:bg-black/5 hover:text-black dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label={translations.comments.replyLabel(formattedDisplayName)}
              onClick={() => {
                if (!isLoggedIn) {
                  onLoginClick()
                  return
                }

                toggleReply(comment.id)
              }}
            >
              <CornerUpLeft className="size-3.5" />
            </Button>
          ) : null}
        </div>
      ) : null}
    </header>
  )
}

function CommentContent({ comment }: { comment: CommentTreeNode }) {
  const translations = useTranslations()

  return (
    <div className="mt-3 text-black dark:text-white">
      {comment.isDeleted ? (
        <p className="text-sm text-black/55 dark:text-white/55">
          <del>{translations.comments.deleted}</del>
        </p>
      ) : (
        <CommentMarkdownContent sanitizedHtmlContent={comment.sanitizedHtmlContent} />
      )}
    </div>
  )
}

function CommentReplyEditor({
  comment,
  formattedDisplayName,
  view,
}: {
  comment: CommentTreeNode
  formattedDisplayName: string
  view: CommentCardView
}) {
  const translations = useTranslations()
  const activeReplyCommentId = useCommentCardStore(state => state.activeReplyCommentId)
  const replyContent = useCommentCardStore(state => state.replyContent)
  const { isCreatingComment, onReplySubmit } = view
  const { clearReply, setReplyContent } = useCommentCardActions()

  if (comment.isDeleted || activeReplyCommentId !== comment.id) return null

  return (
    <div className="mt-4 pt-1">
      <CommentComposer
        value={replyContent}
        isSubmitting={isCreatingComment}
        submitLabel={translations.comments.reply}
        placeholder={translations.comments.replyPlaceholder(formattedDisplayName)}
        title={translations.comments.replyTo(formattedDisplayName)}
        onChange={setReplyContent}
        onCancel={clearReply}
        onSubmit={() => {
          onReplySubmit(comment.id)
        }}
      />
    </div>
  )
}

export function CommentThreadItem({
  comment,
  depth,
  view,
}: {
  comment: CommentTreeNode
  depth: number
  view: CommentCardView
}) {
  const { commentReferenceTime } = view
  const commentCreatedAt = new Date(comment.createdAt)
  const absoluteTime = prettyDateTime(commentCreatedAt)
  const shouldShowRelativeTime =
    Math.abs(commentReferenceTime - commentCreatedAt.getTime()) <= 7 * 24 * 60 * 60 * 1000
  const formattedDisplayName = formatCommentDisplayName(getCommentDisplayName(comment))
  const canReply = depth + 1 < maxCommentLevels

  return (
    <li
      className={cn(
        'group',
        depth === 0 && 'pb-6',
        depth > 0 && 'ml-4 border-l border-black/20 pl-4 sm:ml-7 dark:border-white/20',
      )}
    >
      <div className="flex items-start gap-3">
        <CommentAuthorAvatar comment={comment} />

        <div className="min-w-0 flex-1">
          <article>
            <CommentHeader
              comment={comment}
              commentCreatedAt={commentCreatedAt}
              absoluteTime={absoluteTime}
              shouldShowRelativeTime={shouldShowRelativeTime}
              formattedDisplayName={formattedDisplayName}
              canReply={canReply}
              view={view}
            />

            <CommentContent comment={comment} />
          </article>

          <CommentReplyEditor
            comment={comment}
            formattedDisplayName={formattedDisplayName}
            view={view}
          />

          {canReply && comment.children.length > 0 ? (
            <ul className="mt-5 space-y-5">
              {comment.children.map(childComment => (
                <CommentThreadItem
                  key={childComment.id}
                  comment={childComment}
                  depth={depth + 1}
                  view={view}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  )
}
