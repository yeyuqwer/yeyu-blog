'use client'

import type { CommentParent, CommentTargetType, PublicCommentRecord } from '@/lib/api/comment'
import { CornerUpLeft, MessageCircle, X } from 'lucide-react'
import Image from 'next/image'
import { type ComponentProps, useEffect, useState } from 'react'
import { type Address, isAddress } from 'viem'
import avatar from '@/config/img/avatar.webp'
import { useCommentMutation, usePublicCommentQuery } from '@/hooks/api/comment'
import { isAdminLoggedIn, isEmailLoggedIn, isWalletLoggedIn, useSession } from '@/lib/core'
import { commentProcessor } from '@/lib/core/markdown/comment-processor'
import { cn } from '@/lib/utils/common/shadcn'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/time'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { Textarea } from '@/ui/shadcn/textarea'
import { AccountIcon } from '../account-icon'
import Loading from '../loading'

type CommentCardProps = ComponentProps<'section'> & {
  articleId: number
  articleType: CommentTargetType
}

type CommentTreeNode = PublicCommentRecord & {
  children: CommentTreeNode[]
}

type CommentAuthorLike = Pick<CommentParent, 'authorName' | 'authorImage' | 'isAdmin' | 'user'>

type SessionAvatarProps = {
  isAdminUser: boolean
  isWalletUser: boolean
  sessionAvatar?: string
  sessionAddress?: Address
}

type CommentComposerProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  placeholder: string
  submitLabel: string
  helperText: string
  sessionAvatarProps: SessionAvatarProps
  autoFocus?: boolean
  onCancel?: () => void
  title?: string
}

type CommentThreadItemProps = {
  comment: CommentTreeNode
  depth: number
  sessionUserId?: string
  isLoggedIn: boolean
  activeReplyCommentId: number | null
  replyContent: string
  isCreatingComment: boolean
  sessionAvatarProps: SessionAvatarProps
  onReplyClick: (commentId: number) => void
  onReplyCancel: () => void
  onReplyContentChange: (value: string) => void
  onReplySubmit: (commentId: number) => void
}

const MAX_COMMENT_LENGTH = 500

const commentMarkdownTheme = [
  'markdown-content prose prose-sm max-w-none prose-zinc dark:prose-invert',
  'text-[15px] leading-7',
  'prose-headings:mt-4 prose-headings:mb-2 prose-headings:text-left prose-headings:tracking-tight',
  'prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-sm',
  'prose-h5:text-sm prose-h6:text-sm',
  'prose-p:my-0 prose-p:break-words [&_p+p]:mt-3 [&_p:last-child]:mb-0',
  'prose-a:break-all prose-a:border-current prose-a:border-b prose-a:no-underline',
  'prose-a:text-[#0f766e] prose-a:duration-200 prose-a:hover:text-[#0d9488]',
  'dark:prose-a:text-[#f596aa] dark:prose-a:hover:text-[#f9a8d4]',
  'prose-ul:my-3 prose-ol:my-3 prose-li:my-1',
  'prose-blockquote:my-3 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:font-normal',
  'prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:rounded-md',
  'prose-img:my-3 prose-img:rounded-md',
].join(' ')

function getCommentDisplayName(comment: Pick<CommentAuthorLike, 'authorName' | 'user'>) {
  return comment.user?.name || comment.authorName
}

function formatCommentDisplayName(displayName: string) {
  return isAddress(displayName)
    ? `${displayName.slice(0, 6)}...${displayName.slice(-6)}`
    : displayName
}

function getCommentAvatar(comment: Pick<CommentAuthorLike, 'authorImage' | 'user'>) {
  return comment.user?.image?.trim() || comment.authorImage?.trim() || undefined
}

function getCommentAddress(comment: Pick<CommentAuthorLike, 'user'>) {
  return isAddress(comment.user?.name ?? '') ? (comment.user?.name as Address) : undefined
}

function buildCommentTree(comments: PublicCommentRecord[]) {
  const nodeMap = new Map<number, CommentTreeNode>()
  const roots: CommentTreeNode[] = []

  for (const comment of comments) {
    nodeMap.set(comment.id, {
      ...comment,
      children: [],
    })
  }

  for (const comment of comments) {
    const node = nodeMap.get(comment.id)

    if (node == null) {
      continue
    }

    if (comment.parentId != null) {
      const parentNode = nodeMap.get(comment.parentId)

      if (parentNode != null) {
        parentNode.children.push(node)
        continue
      }
    }

    roots.push(node)
  }

  return roots
}

function SessionAvatar({
  isAdminUser,
  isWalletUser,
  sessionAvatar,
  sessionAddress,
}: SessionAvatarProps) {
  if (isAdminUser) {
    return (
      <Image
        src={avatar}
        alt="admin avatar"
        width={40}
        height={40}
        className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
      />
    )
  }

  if (isWalletUser || sessionAvatar == null) {
    return (
      <AccountIcon
        account={sessionAddress}
        className="size-10 rounded-full border border-zinc-200 dark:border-zinc-700"
      />
    )
  }

  return (
    <Image
      src={sessionAvatar}
      alt="my avatar"
      width={40}
      height={40}
      className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
    />
  )
}

function CommentAuthorAvatar({ comment }: { comment: CommentAuthorLike }) {
  const displayName = getCommentDisplayName(comment)
  const commentAvatar = getCommentAvatar(comment)
  const commentAddress = getCommentAddress(comment)

  if (comment.isAdmin) {
    return (
      <Image
        src={avatar}
        alt={displayName}
        width={40}
        height={40}
        className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
      />
    )
  }

  if (commentAvatar != null) {
    return (
      <Image
        src={commentAvatar}
        alt={displayName}
        width={40}
        height={40}
        className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
      />
    )
  }

  return (
    <AccountIcon
      account={commentAddress}
      className="size-10 rounded-full border border-zinc-200 dark:border-zinc-700"
    />
  )
}

function CommentComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  placeholder,
  submitLabel,
  helperText,
  sessionAvatarProps,
  autoFocus = false,
  onCancel,
  title,
}: CommentComposerProps) {
  const trimmedContent = value.trim()
  const inputExceeded = trimmedContent.length > MAX_COMMENT_LENGTH

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {title != null ? (
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <CornerUpLeft className="size-3.5" />
            <span>{title}</span>
          </div>
        ) : null}
        <Textarea
          placeholder={placeholder}
          value={value}
          autoFocus={autoFocus}
          onChange={event => {
            onChange(event.target.value)
          }}
          className="min-h-24 resize-y rounded-md border-zinc-200 bg-transparent text-sm shadow-none dark:border-zinc-700 dark:bg-transparent"
        />
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>{helperText}</span>
          <span className={inputExceeded ? 'text-red-500 dark:text-red-400' : undefined}>
            {trimmedContent.length}/{MAX_COMMENT_LENGTH}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <SessionAvatar {...sessionAvatarProps} />

        <div className="flex items-center gap-2">
          {onCancel != null ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-zinc-600 dark:text-zinc-300"
            >
              <X className="size-4" />
              取消
            </Button>
          ) : null}
          <Button
            type="button"
            className="shrink-0"
            disabled={trimmedContent.length === 0 || inputExceeded || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? '提交中...' : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

function CommentThreadItem({
  comment,
  depth,
  sessionUserId,
  isLoggedIn,
  activeReplyCommentId,
  replyContent,
  isCreatingComment,
  sessionAvatarProps,
  onReplyClick,
  onReplyCancel,
  onReplyContentChange,
  onReplySubmit,
}: CommentThreadItemProps) {
  const commentCreatedAt = new Date(comment.createdAt)
  const displayName = getCommentDisplayName(comment)
  const formattedDisplayName = formatCommentDisplayName(displayName)
  const isCurrentUserComment = sessionUserId != null && comment.userId === sessionUserId
  const isReplyEditorOpen = activeReplyCommentId === comment.id
  const parentDisplayName =
    comment.parent == null ? null : formatCommentDisplayName(getCommentDisplayName(comment.parent))

  return (
    <li
      className={cn(
        'group',
        depth > 0 && 'ml-6 border-zinc-200 border-l pl-4 dark:border-zinc-800',
      )}
    >
      <div className="flex items-start gap-3.5">
        <CommentAuthorAvatar comment={comment} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
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
                  title={prettyDateTime(commentCreatedAt)}
                >
                  {toRelativeDate(commentCreatedAt)}
                </time>
              </div>

              {parentDisplayName != null ? (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <CornerUpLeft className="size-3.5" />
                  <span>{`回复 ${parentDisplayName}`}</span>
                </div>
              ) : null}
            </div>

            {!isCurrentUserComment ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="shrink-0 text-zinc-500 opacity-100 transition-opacity hover:text-zinc-900 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 dark:text-zinc-400 dark:hover:text-zinc-100"
                aria-label={`回复 ${formattedDisplayName}`}
                onClick={() => {
                  onReplyClick(comment.id)
                }}
              >
                <CornerUpLeft className="size-3.5" />
              </Button>
            ) : null}
          </div>

          <article className="mt-2 text-zinc-900 dark:text-zinc-100">
            <CommentMarkdownContent content={comment.content} />
          </article>

          {isReplyEditorOpen ? (
            <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
              <CommentComposer
                value={replyContent}
                autoFocus
                isSubmitting={isCreatingComment}
                sessionAvatarProps={sessionAvatarProps}
                submitLabel="回复"
                placeholder={`回复 ${formattedDisplayName}...`}
                helperText={isLoggedIn ? '回复提交后可能需要审核。' : '登录后即可回复这条评论。'}
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
                  sessionAvatarProps={sessionAvatarProps}
                  onReplyClick={onReplyClick}
                  onReplyCancel={onReplyCancel}
                  onReplyContentChange={onReplyContentChange}
                  onReplySubmit={onReplySubmit}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  )
}

function CommentMarkdownContent({ content }: { content: string }) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const renderMarkdown = async () => {
      try {
        const file = await commentProcessor.process(content)
        if (active) {
          setHtml(String(file))
        }
      } catch {
        if (active) {
          setHtml(null)
        }
      }
    }

    void renderMarkdown()

    return () => {
      active = false
    }
  }, [content])

  if (html == null) {
    return <p className="whitespace-pre-wrap break-words">{content}</p>
  }

  return <div className={commentMarkdownTheme} dangerouslySetInnerHTML={{ __html: html }} />
}

export default function CommentCard({ articleId, articleType, className }: CommentCardProps) {
  const [commentContent, setCommentContent] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<number | null>(null)
  const { setModalOpen } = useModalStore()

  const { data: session } = useSession()
  const isWalletUser = isWalletLoggedIn({ data: session ?? null })
  const isEmailUser = isEmailLoggedIn({ data: session ?? null })
  const isAdminUser = isAdminLoggedIn({ data: session ?? null })
  const isLoggedIn = isEmailUser || isWalletUser

  const { data, isPending } = usePublicCommentQuery({
    targetType: articleType,
    targetId: articleId,
    take: 50,
  })
  const comments = data?.list ?? []
  const commentTree = buildCommentTree(comments)

  const { mutate: createComment, isPending: isCreatingComment } = useCommentMutation()

  const sessionAddress = isAddress(session?.user?.name ?? '')
    ? (session?.user?.name as Address)
    : undefined
  const sessionAvatar = session?.user?.image?.trim() || undefined
  const sessionAvatarProps = {
    isAdminUser,
    isWalletUser,
    sessionAvatar,
    sessionAddress,
  }

  const submitComment = ({
    content,
    parentId,
    onSuccess,
  }: {
    content: string
    parentId?: number
    onSuccess: () => void
  }) => {
    const trimmedContent = content.trim()

    if (
      !isLoggedIn ||
      articleId <= 0 ||
      trimmedContent.length === 0 ||
      trimmedContent.length > MAX_COMMENT_LENGTH
    ) {
      return
    }

    createComment(
      {
        targetType: articleType,
        targetId: articleId,
        parentId,
        content: trimmedContent,
      },
      {
        onSuccess: () => {
          onSuccess()
        },
      },
    )
  }

  const handleReplyClick = (commentId: number) => {
    if (!isLoggedIn) {
      setModalOpen('loginModal')
      return
    }

    if (activeReplyCommentId === commentId) {
      setActiveReplyCommentId(null)
      setReplyContent('')
      return
    }

    setActiveReplyCommentId(commentId)
    setReplyContent('')
  }

  const handleReplyCancel = () => {
    setActiveReplyCommentId(null)
    setReplyContent('')
  }

  return (
    <section id="comments" className={cn('py-2 sm:py-4', className)}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MessageCircle className="size-4 text-zinc-500 dark:text-zinc-400" />
            <h2 className="font-medium text-lg text-zinc-900 dark:text-zinc-100">评论</h2>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {data?.total != null && data.total > 0
              ? `共 ${data.total} 条评论`
              : '还没有评论，来发表第一条评论吧'}
          </p>
        </div>
      </header>

      <section className="mt-6 pt-5 dark:border-zinc-800/80">
        {isLoggedIn ? (
          <CommentComposer
            value={commentContent}
            isSubmitting={isCreatingComment}
            sessionAvatarProps={sessionAvatarProps}
            placeholder="写下你的评论..."
            submitLabel="发布"
            helperText="评论提交后可能需要审核。"
            onChange={setCommentContent}
            onSubmit={() => {
              submitComment({
                content: commentContent,
                onSuccess: () => {
                  setCommentContent('')
                },
              })
            }}
          />
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">登录后即可参与评论。</p>
            <Button
              type="button"
              onClick={() => {
                setModalOpen('loginModal')
              }}
            >
              登录后评论
            </Button>
          </div>
        )}
      </section>

      <section className="mt-6 min-h-24">
        {isPending ? (
          <div className="flex min-h-24 items-center justify-center">
            <Loading />
          </div>
        ) : commentTree.length === 0 ? (
          <div className="px-1 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            评论会在这里按时间倒序展开，回复会以缩进形式挂在对应楼层下面。
          </div>
        ) : (
          <ul className="space-y-4">
            {commentTree.map(comment => (
              <CommentThreadItem
                key={comment.id}
                comment={comment}
                depth={0}
                sessionUserId={session?.user?.id}
                isLoggedIn={isLoggedIn}
                activeReplyCommentId={activeReplyCommentId}
                replyContent={replyContent}
                isCreatingComment={isCreatingComment}
                sessionAvatarProps={sessionAvatarProps}
                onReplyClick={handleReplyClick}
                onReplyCancel={handleReplyCancel}
                onReplyContentChange={setReplyContent}
                onReplySubmit={commentId => {
                  submitComment({
                    content: replyContent,
                    parentId: commentId,
                    onSuccess: () => {
                      setReplyContent('')
                      setActiveReplyCommentId(null)
                    },
                  })
                }}
              />
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}
