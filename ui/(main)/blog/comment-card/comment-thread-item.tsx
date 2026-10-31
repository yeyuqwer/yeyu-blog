import type { ReactNode } from 'react'
import type { CommentCardView, CommentTreeNode } from './type'
import { CornerUpLeft } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/common/time'
import { useCommentCardActions, useCommentCardStore } from '@/store/use-comment-card-store'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
import { Button } from '@/ui/shadcn/button'
import { CommentAuthorAvatar } from './comment-avatar'
import { CommentComposer } from './comment-composer'
import { CommentDeleteAction } from './comment-delete-action'
import { CommentMarkdownContent } from './comment-markdown-content'
import { formatCommentDisplayName, getCommentDisplayName } from './helper'

const replyLineColors = [
  '#f87171',
  '#fb923c',
  '#facc15',
  '#4ade80',
  '#38bdf8',
  '#818cf8',
  '#c084fc',
]

function CommentReplies({ children }: { children: ReactNode }) {
  const listRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    const color = replyLineColors[Math.floor(Math.random() * replyLineColors.length)]
    listRef.current?.style.setProperty('--reply-line-color', color)
  }, [])

  return (
    <ul
      ref={listRef}
      className="relative mt-4 space-y-4 pl-3 before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:rounded-full before:bg-[color:var(--reply-line-color)] sm:pl-4"
    >
      {children}
    </ul>
  )
}

function CommentHeader({
  comment,
  commentCreatedAt,
  absoluteTime,
  shouldShowRelativeTime,
  formattedDisplayName,
  view,
}: {
  comment: CommentTreeNode
  commentCreatedAt: Date
  absoluteTime: string
  shouldShowRelativeTime: boolean
  formattedDisplayName: string
  view: CommentCardView
}) {
  const translations = useTranslations()
  const { sessionUserId, isLoggedIn, onLoginClick } = view
  const { toggleReply } = useCommentCardActions()
  const isCurrentUserComment = sessionUserId != null && comment.userId === sessionUserId
  const canDeleteComment = !comment.isDeleted && isCurrentUserComment
  const parentDisplayName =
    comment.parent == null ? null : formatCommentDisplayName(getCommentDisplayName(comment.parent))
  const createdAtIso = commentCreatedAt.toISOString()

  return (
    <header className="flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0 flex-1 basis-28">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5">
          <span className="max-w-40 truncate text-[13px] font-medium text-black/90 dark:text-white/90">
            {formattedDisplayName}
          </span>
          {comment.isAdmin ? (
            <span className="text-[10px] text-black/55 dark:text-white/55">
              <LanguageText>{translations.comments.admin}</LanguageText>
            </span>
          ) : null}
          {isCurrentUserComment ? (
            <span className="text-[10px] text-black/50 dark:text-white/50">
              <LanguageText>{translations.comments.you}</LanguageText>
            </span>
          ) : null}
          <time
            className="text-[11px] text-black/50 tabular-nums dark:text-white/50"
            dateTime={createdAtIso}
            title={absoluteTime}
          >
            {shouldShowRelativeTime ? toRelativeDate(commentCreatedAt) : absoluteTime}
          </time>
        </div>

        {parentDisplayName != null ? (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-black/50 dark:text-white/50">
            <CornerUpLeft aria-hidden className="size-3 shrink-0" />
            <LanguageText>{translations.comments.replyTo(parentDisplayName)}</LanguageText>
          </div>
        ) : null}
      </div>

      {!comment.isDeleted ? (
        <div className="ml-auto flex shrink-0 items-center gap-0.5">
          {canDeleteComment ? (
            <CommentDeleteAction
              commentId={comment.id}
              displayName={formattedDisplayName}
              view={view}
            />
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="size-7 rounded-lg text-black/45 hover:bg-black/5 hover:text-black motion-reduce:transition-none dark:text-white/45 dark:hover:bg-white/5 dark:hover:text-white"
            aria-label={translations.comments.replyLabel(formattedDisplayName)}
            onClick={() => {
              if (!isLoggedIn) {
                onLoginClick()
                return
              }

              toggleReply(comment.id)
            }}
          >
            <CornerUpLeft aria-hidden className="size-3.5" />
          </Button>
        </div>
      ) : null}
    </header>
  )
}

function CommentContent({ comment }: { comment: CommentTreeNode }) {
  const translations = useTranslations()

  return (
    <div className="mt-1.5 text-black/85 dark:text-white/85">
      {comment.isDeleted ? (
        <p className="text-sm text-black/55 dark:text-white/55">
          <del>
            <LanguageText>{translations.comments.deleted}</LanguageText>
          </del>
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
    <div className="mt-3">
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

  return (
    <li className={depth === 0 ? 'py-4 first:pt-0 last:pb-0' : undefined}>
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
              view={view}
            />

            <CommentContent comment={comment} />
          </article>

          <CommentReplyEditor
            comment={comment}
            formattedDisplayName={formattedDisplayName}
            view={view}
          />

          {comment.children.length > 0 ? (
            <CommentReplies>
              {comment.children.map(childComment => (
                <CommentThreadItem
                  key={childComment.id}
                  comment={childComment}
                  depth={depth + 1}
                  view={view}
                />
              ))}
            </CommentReplies>
          ) : null}
        </div>
      </div>
    </li>
  )
}
