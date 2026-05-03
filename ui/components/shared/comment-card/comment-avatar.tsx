import type { ReactNode } from 'react'
import type { CommentAuthorLike, SessionAvatarProps } from './type'
import Image from 'next/image'
import { siGithub, siGoogle } from 'simple-icons'
import avatar from '@/config/img/avatar.webp'
import { AccountIcon } from '../account-icon'
import {
  getCommentAddress,
  getCommentAvatar,
  getCommentDisplayName,
  getCommentGithubAccountId,
  getCommentLoginProvider,
} from './helper'

const avatarImageClassName =
  'size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700'

export function SessionAvatar({
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
        className={avatarImageClassName}
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
      className={avatarImageClassName}
    />
  )
}

function CommentProviderIcon({ provider }: { provider: 'github' | 'google' }) {
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

function CommentAvatarFrame({
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
      {provider != null ? <CommentProviderIcon provider={provider} /> : null}
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

export function CommentAuthorAvatar({ comment }: { comment: CommentAuthorLike }) {
  const displayName = getCommentDisplayName(comment)
  const commentAvatar = getCommentAvatar(comment)
  const commentAddress = getCommentAddress(comment)
  const provider = getCommentLoginProvider(comment)
  const githubAccountId = getCommentGithubAccountId(comment)

  if (comment.isAdmin) {
    return (
      <CommentAvatarFrame
        displayName={displayName}
        provider={provider}
        githubAccountId={githubAccountId}
      >
        <Image
          src={avatar}
          alt={displayName}
          width={40}
          height={40}
          className={avatarImageClassName}
        />
      </CommentAvatarFrame>
    )
  }

  if (commentAvatar != null) {
    return (
      <CommentAvatarFrame
        displayName={displayName}
        provider={provider}
        githubAccountId={githubAccountId}
      >
        <Image
          src={commentAvatar}
          alt={displayName}
          width={40}
          height={40}
          className={avatarImageClassName}
        />
      </CommentAvatarFrame>
    )
  }

  return (
    <CommentAvatarFrame
      displayName={displayName}
      provider={provider}
      githubAccountId={githubAccountId}
    >
      <AccountIcon
        account={commentAddress}
        className="size-10 rounded-full border border-zinc-200 dark:border-zinc-700"
      />
    </CommentAvatarFrame>
  )
}
