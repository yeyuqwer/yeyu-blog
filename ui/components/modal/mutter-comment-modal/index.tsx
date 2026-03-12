'use client'

import { MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { type Address, isAddress } from 'viem'
import avatar from '@/config/img/avatar.webp'
import { useMutterCommentMutation, usePublicMutterCommentQuery } from '@/hooks/api/mutter-comment'
import { isAdminLoggedIn, isEmailLoggedIn, isWalletLoggedIn, useSession } from '@/lib/core'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/time'
import { useModalStore } from '@/store/use-modal-store'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import Loading from '@/ui/components/shared/loading'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { ScrollArea } from '@/ui/shadcn/scroll-area'
import { Textarea } from '@/ui/shadcn/textarea'

type MutterCommentPayload = {
  mutterId: number
  content: string
  createdAt: string
}

const normalizeImageSrc = (value?: string | null) => {
  if (value == null) {
    return undefined
  }

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

const formatDisplayName = (value: string) => {
  if (!isAddress(value)) {
    return value
  }

  return `${value.slice(0, 6)}...${value.slice(-6)}`
}

export default function MutterCommentModal() {
  const { modalType, payload, onModalClose, setModalOpen } = useModalStore()
  const isModalOpen = modalType === 'mutterCommentModal'
  const values = payload != null ? (payload as MutterCommentPayload) : null
  const mutterId = values?.mutterId ?? 0
  const createdAt = values?.createdAt != null ? new Date(values.createdAt) : null
  const hasValidCreatedAt = createdAt != null && !Number.isNaN(createdAt.getTime())
  const [commentContent, setCommentContent] = useState('')
  const trimmedComment = commentContent.trim()

  const { data: session } = useSession()
  const isWalletUser = isWalletLoggedIn({ data: session ?? null })
  const isEmailUser = isEmailLoggedIn({ data: session ?? null })
  const isAdminUser = isAdminLoggedIn({ data: session ?? null })

  const isLoggedIn = useMemo(() => isEmailUser || isWalletUser, [isEmailUser, isWalletUser])

  const { data: commentListData, isPending: isCommentListPending } = usePublicMutterCommentQuery({
    mutterId,
    take: 50,
    enabled: isModalOpen && mutterId > 0,
  })
  const comments = commentListData?.list ?? []
  const { mutateAsync: createComment, isPending: isCreatingComment } = useMutterCommentMutation()
  const sessionAddress = isAddress(session?.user?.name ?? '')
    ? (session?.user?.name as Address)
    : undefined
  const sessionAvatar = normalizeImageSrc(session?.user?.image)

  const handleSubmitComment = async () => {
    if (!isLoggedIn || mutterId <= 0 || trimmedComment.length === 0) {
      return
    }

    try {
      const response = await createComment({
        mutterId,
        content: trimmedComment,
      })
      toast.success(response.message)
      setCommentContent('')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to submit comment.')
      }
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="rounded-2xl border-zinc-200 bg-theme-background/80 backdrop-blur-xl sm:max-w-[580px] dark:border-zinc-800 dark:bg-black/70">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 font-bold text-xl text-zinc-900 dark:text-zinc-100">
            <MessageCircle className="size-5 text-zinc-600 dark:text-zinc-300" />
            评论
          </DialogTitle>
        </DialogHeader>

        <section className="flex items-start gap-3.5">
          <Image
            src={avatar}
            alt="my avatar"
            className="size-10 rounded-full border border-zinc-200 object-cover grayscale dark:border-zinc-700"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {hasValidCreatedAt ? (
              <time
                dateTime={createdAt.toISOString()}
                title={prettyDateTime(createdAt)}
                className="font-mono text-[11px] text-zinc-500 uppercase tracking-[0.12em] dark:text-zinc-400"
              >
                {toRelativeDate(createdAt)}
              </time>
            ) : null}
            <article className="rounded-xl border border-[#00000011] bg-theme-background/80 px-4 py-3 text-[15px] text-zinc-900 leading-7 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
              <p className="wrap-break-word whitespace-pre-wrap">{values?.content ?? ''}</p>
            </article>
          </div>
        </section>

        <section>
          <ScrollArea className="h-64 px-2 py-1">
            {isCommentListPending ? (
              <div className="flex h-full min-h-32 items-center justify-center">
                <Loading />
              </div>
            ) : comments.length === 0 ? (
              <div className="flex h-full min-h-32 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
                还没有评论，来发表第一条评论吧
              </div>
            ) : (
              <ul className="space-y-3 py-1">
                {comments.map(comment => {
                  const commentCreatedAt = new Date(comment.createdAt)
                  const displayName = comment.user?.name || comment.authorName
                  const formattedDisplayName = formatDisplayName(displayName)
                  const isCurrentUserComment =
                    session?.user?.id != null && comment.userId === session.user.id
                  const commentAvatar =
                    normalizeImageSrc(comment.user?.image) ?? normalizeImageSrc(comment.authorImage)
                  const commentAddress = isAddress(comment.user?.name ?? '')
                    ? (comment.user?.name as Address)
                    : undefined
                  return (
                    <li
                      key={comment.id}
                      className={
                        isCurrentUserComment
                          ? 'flex flex-row-reverse items-start gap-3.5'
                          : 'flex items-start gap-3.5'
                      }
                    >
                      {comment.isAdmin ? (
                        <span className="relative inline-flex">
                          <Image
                            src={avatar}
                            alt={displayName}
                            width={40}
                            height={40}
                            className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                          />
                        </span>
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
                      <div
                        className={
                          isCurrentUserComment
                            ? 'flex min-w-0 flex-1 flex-col items-end'
                            : 'flex min-w-0 flex-1 flex-col items-start'
                        }
                      >
                        <div
                          className={
                            isCurrentUserComment
                              ? 'flex items-center justify-end gap-2 text-right text-xs'
                              : 'flex items-center gap-2 text-xs'
                          }
                        >
                          <span
                            className={
                              comment.isAdmin
                                ? 'max-w-40 truncate font-medium text-theme-indicator'
                                : 'max-w-40 truncate font-medium text-zinc-800 dark:text-zinc-100'
                            }
                          >
                            {formattedDisplayName}
                          </span>
                          <time
                            className="text-zinc-500 dark:text-zinc-400"
                            title={prettyDateTime(commentCreatedAt)}
                          >
                            {toRelativeDate(commentCreatedAt)}
                          </time>
                        </div>
                        <article
                          className={
                            isCurrentUserComment
                              ? 'mt-1 max-w-full rounded-xl border border-[#00000011] bg-theme-background/80 px-4 py-3 text-right text-sm text-zinc-700 leading-6 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
                              : 'mt-1 max-w-full rounded-xl border border-[#00000011] bg-theme-background/80 px-4 py-3 text-sm text-zinc-700 leading-6 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
                          }
                        >
                          <p className="whitespace-pre-wrap">{comment.content}</p>
                        </article>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </ScrollArea>
        </section>

        <section className="mt-2 pt-2">
          {isLoggedIn ? (
            <div className="flex items-stretch gap-3.5">
              <div className="flex min-w-0 flex-1 flex-col">
                <Textarea
                  placeholder="写下你的评论..."
                  value={commentContent}
                  onChange={event => {
                    setCommentContent(event.target.value)
                  }}
                  className="min-h-24 resize-y rounded-xl border-zinc-200 bg-theme-background/80 text-sm dark:border-zinc-700 dark:bg-zinc-900/80"
                />
              </div>

              <div className="flex w-20 shrink-0 flex-col items-center justify-between gap-3">
                {isAdminUser ? (
                  <span className="relative inline-flex">
                    <Image
                      src={avatar}
                      alt="admin avatar"
                      width={40}
                      height={40}
                      className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                    />
                  </span>
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
                  size="sm"
                  className="w-full"
                  disabled={trimmedComment.length === 0 || isCreatingComment}
                  onClick={() => {
                    void handleSubmitComment()
                  }}
                >
                  {isCreatingComment ? '提交中...' : '发布'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-end">
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  setModalOpen('loginModal')
                }}
              >
                登录后评论
              </Button>
            </div>
          )}
        </section>
      </DialogContent>
    </Dialog>
  )
}
