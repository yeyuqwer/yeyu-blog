'use client'

import type { CommentTargetType } from '@/lib/api/comment'
import { MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { type ComponentProps, useEffect, useState } from 'react'
import { type Address, isAddress } from 'viem'
import avatar from '@/config/img/avatar.webp'
import { useCommentMutation, usePublicCommentQuery } from '@/hooks/api/comment'
import { isAdminLoggedIn, isEmailLoggedIn, isWalletLoggedIn, useSession } from '@/lib/core'
import { commentProcessor } from '@/lib/core/markdown/comment-processor'
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
  const trimmedComment = commentContent.trim()
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

  const { mutate: createComment, isPending: isCreatingComment } = useCommentMutation()

  const sessionAddress = isAddress(session?.user?.name ?? '')
    ? (session?.user?.name as Address)
    : undefined
  const sessionAvatar = session?.user?.image?.trim() || undefined
  const inputExceeded = trimmedComment.length > 500

  const handleSubmitComment = () => {
    if (!isLoggedIn || articleId <= 0 || trimmedComment.length === 0 || inputExceeded) {
      return
    }

    createComment(
      {
        targetType: articleType,
        targetId: articleId,
        content: trimmedComment,
      },
      {
        onSuccess: () => {
          setCommentContent('')
        },
      },
    )
  }

  return (
    <section id="comments" className={['py-2 sm:py-4', className].filter(Boolean).join(' ')}>
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
          <div className="flex flex-col gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Textarea
                placeholder="写下你的评论..."
                value={commentContent}
                onChange={event => {
                  setCommentContent(event.target.value)
                }}
                className="min-h-28 resize-y rounded-md border-zinc-200 bg-transparent text-sm shadow-none dark:border-zinc-700 dark:bg-transparent"
              />
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>评论提交后可能需要审核。</span>
                <span className={inputExceeded ? 'text-red-500 dark:text-red-400' : undefined}>
                  {trimmedComment.length}/500
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              {isAdminUser ? (
                <Image
                  src={avatar}
                  alt="admin avatar"
                  width={40}
                  height={40}
                  className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                />
              ) : isWalletUser || sessionAvatar == null ? (
                <AccountIcon
                  account={sessionAddress}
                  className="size-10 rounded-full border border-zinc-200 dark:border-zinc-700"
                />
              ) : (
                <Image
                  src={sessionAvatar}
                  alt="my avatar"
                  width={40}
                  height={40}
                  className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                />
              )}

              <Button
                type="button"
                className="shrink-0"
                disabled={trimmedComment.length === 0 || inputExceeded || isCreatingComment}
                onClick={() => {
                  handleSubmitComment()
                }}
              >
                {isCreatingComment ? '提交中...' : '发布'}
              </Button>
            </div>
          </div>
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
        ) : comments.length === 0 ? (
          <div className="px-1 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            评论会在这里按时间倒序展开。
          </div>
        ) : (
          <ul className="space-y-4">
            {comments.map(comment => {
              const commentCreatedAt = new Date(comment.createdAt)
              const displayName = comment.user?.name || comment.authorName
              const formattedDisplayName = isAddress(displayName)
                ? `${displayName.slice(0, 6)}...${displayName.slice(-6)}`
                : displayName
              const isCurrentUserComment =
                session?.user?.id != null && comment.userId === session.user.id
              const commentAvatar =
                comment.user?.image?.trim() || comment.authorImage?.trim() || undefined
              const commentAddress = isAddress(comment.user?.name ?? '')
                ? (comment.user?.name as Address)
                : undefined

              return (
                <li key={comment.id} className="flex items-start gap-3.5">
                  {comment.isAdmin ? (
                    <Image
                      src={avatar}
                      alt={displayName}
                      width={40}
                      height={40}
                      className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                    />
                  ) : commentAvatar != null ? (
                    <Image
                      src={commentAvatar}
                      alt={displayName}
                      width={40}
                      height={40}
                      className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                    />
                  ) : (
                    <AccountIcon
                      account={commentAddress}
                      className="size-10 rounded-full border border-zinc-200 dark:border-zinc-700"
                    />
                  )}

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

                    <article className="mt-2 text-zinc-900 dark:text-zinc-100">
                      <CommentMarkdownContent content={comment.content} />
                    </article>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </section>
  )
}
