'use client'

import { LogIn, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { type ComponentProps, type FC, useMemo, useState } from 'react'
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
import { Textarea } from '@/ui/shadcn/textarea'

export const MutterCommentModal: FC<ComponentProps<'div'>> = () => {
  const modalType = useModalStore(s => s.modalType)
  const payload = useModalStore(s => s.payload)
  const closeModal = useModalStore(s => s.closeModal)
  const setModalOpen = useModalStore(s => s.setModalOpen)
  const isModalOpen = modalType === 'mutterCommentModal'
  const values =
    isModalOpen && payload != null
      ? (payload as {
          mutterId: number
          content: string
          createdAt: string
        })
      : null
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

  const { data: commentListData, isLoading: isCommentListLoading } = usePublicMutterCommentQuery({
    mutterId,
    take: 50,
    enabled: isModalOpen && mutterId > 0,
  })
  const comments = commentListData?.list ?? []
  const { mutate: createComment, isPending: isCreatingComment } = useMutterCommentMutation()
  const sessionAddress = isAddress(session?.user?.name ?? '')
    ? (session?.user?.name as Address)
    : undefined
  const sessionAvatar = session?.user?.image?.trim() || undefined

  const handleSubmitComment = () => {
    if (!isLoggedIn || mutterId <= 0 || trimmedComment.length === 0) {
      return
    }

    createComment(
      {
        mutterId,
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
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-h-[88vh] overflow-hidden rounded-2xl border-zinc-200 bg-theme-background/80 backdrop-blur-xl sm:max-w-[580px] dark:border-zinc-800 dark:bg-black/70">
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
            <article className="rounded-xl border border-[#00000022] bg-theme-background/80 px-4 py-3 text-[15px] text-zinc-900 leading-7 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
              <p className="wrap-break-word whitespace-pre-wrap">{values?.content ?? ''}</p>
            </article>
          </div>
        </section>

        <section className="min-h-0">
          <div
            className="h-64 overflow-y-auto overscroll-contain py-1 pr-2 [scrollbar-color:rgba(113,113,122,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[3px]"
            onWheel={event => {
              event.stopPropagation()
            }}
          >
            {isCommentListLoading ? (
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
                        <article className="mt-1 rounded-xl border border-[#00000022] bg-theme-background/80 px-4 py-2 text-[15px] text-zinc-900 leading-7 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                          <p
                            className={
                              isCurrentUserComment
                                ? 'wrap-break-word whitespace-pre-wrap text-right'
                                : 'wrap-break-word whitespace-pre-wrap'
                            }
                          >
                            {comment.content}
                          </p>
                        </article>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
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
                  className="h-9 w-full cursor-pointer rounded-xl bg-theme-indicator text-theme-active-text shadow-none hover:bg-[color-mix(in_srgb,var(--theme-indicator)_92%,black)] hover:text-theme-active-text focus-visible:ring-theme-ring/35 disabled:cursor-not-allowed disabled:bg-theme-indicator disabled:text-theme-active-text disabled:opacity-45"
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
                className="h-10 w-full cursor-pointer rounded-xl bg-theme-indicator text-theme-active-text shadow-none hover:bg-[color-mix(in_srgb,var(--theme-indicator)_92%,black)] hover:text-theme-active-text focus-visible:ring-theme-ring/35"
                onClick={() => {
                  setModalOpen('loginModal')
                }}
              >
                <LogIn className="size-4" />
                登录后评论
              </Button>
            </div>
          )}
        </section>
      </DialogContent>
    </Dialog>
  )
}
