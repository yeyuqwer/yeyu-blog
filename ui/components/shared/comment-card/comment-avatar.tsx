import type { CommentAuthorLike, SessionAvatarProps } from './type'
import Image from 'next/image'
import avatar from '@/config/img/avatar.webp'
import { AccountIcon } from '../account-icon'
import { getCommentAddress, getCommentAvatar, getCommentDisplayName } from './helper'

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

export function CommentAuthorAvatar({ comment }: { comment: CommentAuthorLike }) {
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
        className={avatarImageClassName}
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
        className={avatarImageClassName}
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
