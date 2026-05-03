'use client'

import type { PublicMutterCommentRecord } from '@/lib/api/mutter-comment'
import { LogIn, MessageCircle, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { type ComponentProps, type FC, type ReactNode, useMemo, useState } from 'react'
import { siGithub, siGoogle } from 'simple-icons'
import { type Address, isAddress } from 'viem'
import avatar from '@/config/img/avatar.webp'
import {
  useMutterCommentDeleteMutation,
  useMutterCommentMutation,
  usePublicMutterCommentQuery,
} from '@/hooks/api/mutter-comment'
import { isAdminLoggedIn, isEmailLoggedIn, isWalletLoggedIn, useSession } from '@/lib/core/auth'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/time'
import { useModalStore } from '@/store/use-modal-store'
import { MainConfirmModal } from '@/ui/components/modal/main/main-confirm-modal'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import Loading from '@/ui/components/shared/loading'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { Textarea } from '@/ui/shadcn/textarea'

const mutterCommentAvatarImageClassName =
  'size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700'

function getMutterCommentLoginProvider(comment: PublicMutterCommentRecord) {
  if (comment.user?.accounts?.some(account => account.providerId === 'github')) {
    return 'github'
  }

  if (comment.user?.accounts?.some(account => account.providerId === 'google')) {
    return 'google'
  }

  return undefined
}

function getMutterCommentGithubAccountId(comment: PublicMutterCommentRecord) {
  const githubAccount = comment.user?.accounts?.find(account => account.providerId === 'github')

  return githubAccount?.accountId
}

function MutterCommentProviderIcon({ provider }: { provider: 'github' | 'google' }) {
  const icon = provider === 'github' ? siGithub : siGoogle

  return (
    <span
      className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full border border-white bg-white text-zinc-950 shadow-sm dark:border-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
      title={icon.title}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={provider === 'google' ? 'size-2.5 text-[#4285F4]' : 'size-2.5'}
      >
        <path d={icon.path} />
      </svg>
      <span className="sr-only">{icon.title}</span>
    </span>
  )
}

function MutterCommentAvatarFrame({
  children,
  displayName,
  githubAccountId,
  provider,
}: {
  children: ReactNode
  displayName: string
  githubAccountId?: string
  provider?: 'github' | 'google'
}) {
  const avatarContent = (
    <>
      {children}
      {provider != null ? <MutterCommentProviderIcon provider={provider} /> : null}
    </>
  )

  if (provider === 'github' && githubAccountId != null) {
    return (
      <a
        href={`/api/github-user/${encodeURIComponent(githubAccountId)}`}
        target="_blank"
        rel="noreferrer"
        className="relative inline-flex size-10 shrink-0 rounded-full outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-theme-indicator/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`打开 ${displayName} 的 GitHub 主页`}
      >
        {avatarContent}
      </a>
    )
  }

  return <span className="relative inline-flex size-10 shrink-0 rounded-full">{avatarContent}</span>
}

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
  const [deletingComment, setDeletingComment] = useState<PublicMutterCommentRecord | null>(null)
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
  const { mutate: deleteComment, isPending: isDeletingComment } = useMutterCommentDeleteMutation()
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

  const confirmDeleteComment = () => {
    if (deletingComment == null) {
      return
    }

    deleteComment(
      {
        id: deletingComment.id,
        mutterId: deletingComment.mutterId,
      },
      {
        onSuccess: () => {
          setDeletingComment(null)
        },
      },
    )
  }

  return (
    <>
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
                    const isDeletedComment = comment.isDeleted
                    const commentCreatedAt = new Date(comment.createdAt)
                    const displayName = comment.user?.name || comment.authorName
                    const formattedDisplayName = isAddress(displayName)
                      ? `${displayName.slice(0, 6)}...${displayName.slice(-6)}`
                      : displayName
                    const isCurrentUserComment =
                      session?.user?.id != null && comment.userId === session.user.id
                    const canDeleteComment = !isDeletedComment && isCurrentUserComment
                    const commentAvatar =
                      comment.user?.image?.trim() || comment.authorImage?.trim() || undefined
                    const commentAddress = isAddress(comment.user?.name ?? '')
                      ? (comment.user?.name as Address)
                      : undefined
                    const provider = getMutterCommentLoginProvider(comment)
                    const githubAccountId = getMutterCommentGithubAccountId(comment)

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
                          <MutterCommentAvatarFrame
                            displayName={displayName}
                            provider={provider}
                            githubAccountId={githubAccountId}
                          >
                            <Image
                              src={avatar}
                              alt={displayName}
                              width={40}
                              height={40}
                              className={mutterCommentAvatarImageClassName}
                            />
                          </MutterCommentAvatarFrame>
                        ) : commentAvatar != null ? (
                          <MutterCommentAvatarFrame
                            displayName={displayName}
                            provider={provider}
                            githubAccountId={githubAccountId}
                          >
                            <Image
                              src={commentAvatar}
                              alt={displayName}
                              width={40}
                              height={40}
                              className={mutterCommentAvatarImageClassName}
                            />
                          </MutterCommentAvatarFrame>
                        ) : (
                          <MutterCommentAvatarFrame
                            displayName={displayName}
                            provider={provider}
                            githubAccountId={githubAccountId}
                          >
                            <AccountIcon
                              account={commentAddress}
                              className="size-10 rounded-full border border-zinc-200 dark:border-zinc-700"
                            />
                          </MutterCommentAvatarFrame>
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
                            {isDeletedComment ? (
                              <span className="text-zinc-400 dark:text-zinc-500">（已删除）</span>
                            ) : null}
                            {canDeleteComment ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                className="rounded-lg text-zinc-500 hover:text-destructive dark:text-zinc-400"
                                aria-label="删除我的评论"
                                disabled={isDeletingComment}
                                onClick={() => {
                                  setDeletingComment(comment)
                                }}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            ) : null}
                          </div>
                          <article className="mt-1 rounded-xl border border-[#00000022] bg-theme-background/80 px-4 py-2 text-[15px] text-zinc-900 leading-7 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                            <p
                              className={
                                isCurrentUserComment
                                  ? 'wrap-break-word whitespace-pre-wrap text-right'
                                  : 'wrap-break-word whitespace-pre-wrap'
                              }
                            >
                              {isDeletedComment ? <del>已删除</del> : comment.content}
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
                        className={mutterCommentAvatarImageClassName}
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
                      className={mutterCommentAvatarImageClassName}
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
                    {isCreatingComment ? '稍等' : '发布'}
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

      <MainConfirmModal
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
          <div className="rounded-xl border border-theme-border/70 bg-theme-surface/55 p-3 text-sm dark:border-theme-400/20 dark:bg-theme-950/35">
            <p className="font-medium">
              {deletingComment.user?.name ?? deletingComment.authorName}
            </p>
            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-theme-muted-foreground text-xs dark:text-theme-200/75">
              {deletingComment.content}
            </p>
          </div>
        ) : null}
      </MainConfirmModal>
    </>
  )
}
