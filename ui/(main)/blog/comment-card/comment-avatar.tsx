import type { ReactNode } from 'react'
import type { CommentAuthorLike } from './type'
import Image from 'next/image'
import avatar from '@/config/img/avatar.webp'
import { GitHubIcon } from '@/ui/components/modal/main/login-modal/assets/github-icon'
import { GoogleIcon } from '@/ui/components/modal/main/login-modal/assets/google-icon'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import { getCommentAuthor } from './helper'

function CommentProviderIcon({ provider }: { provider: 'github' | 'google' }) {
  const Icon = provider === 'github' ? GitHubIcon : GoogleIcon
  const title = provider === 'github' ? 'GitHub' : 'Google'

  return (
    <span
      className="bg-theme-background absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full border border-black/15 text-black shadow-sm dark:border-white/20 dark:text-white"
      title={title}
    >
      <Icon
        aria-hidden="true"
        className={provider === 'google' ? 'size-2.5 text-[#4285F4]' : 'size-2.5'}
      />
      <span className="sr-only">{title}</span>
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
  const translations = useTranslations()
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
        className="focus-visible:ring-offset-theme-background relative inline-flex size-10 shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-black/45 focus-visible:ring-offset-2 dark:focus-visible:ring-white/45"
        aria-label={translations.comments.openGithubProfile(displayName)}
      >
        {avatarContent}
      </a>
    )
  }

  return <span className="relative inline-flex size-10 shrink-0 rounded-full">{avatarContent}</span>
}

export function CommentAuthorAvatar({ comment }: { comment: CommentAuthorLike }) {
  const {
    displayName,
    avatar: commentAvatar,
    address,
    provider,
    githubAccountId,
  } = getCommentAuthor(comment)
  const avatarContent = comment.isAdmin ? (
    <Image
      src={avatar}
      alt={displayName}
      width={40}
      height={40}
      className="bg-theme-surface size-10 rounded-full border border-black/15 object-cover dark:border-white/15"
    />
  ) : commentAvatar != null ? (
    <Image
      src={commentAvatar}
      alt={displayName}
      width={40}
      height={40}
      className="bg-theme-surface size-10 rounded-full border border-black/15 object-cover dark:border-white/15"
    />
  ) : (
    <AccountIcon
      account={address}
      className="bg-theme-surface size-10 rounded-full border border-black/15 dark:border-white/15"
    />
  )

  return (
    <CommentAvatarFrame
      displayName={displayName}
      provider={provider}
      githubAccountId={githubAccountId}
    >
      {avatarContent}
    </CommentAvatarFrame>
  )
}
