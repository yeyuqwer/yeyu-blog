'use client'

import { FriendLinkApplyModal } from '@/ui/components/modal/main/friend-link-apply-modal'
import { LoginModal } from '@/ui/components/modal/main/login-modal'
import { MutterCommentModal } from '@/ui/components/modal/main/mutter-comment-modal'
import { SelectThemeModal } from '@/ui/components/modal/main/select-theme-modal'

export function MainModalProvider({
  children,
  friendLinkEmailPlaceholder,
}: {
  children: React.ReactNode
  friendLinkEmailPlaceholder?: string
}) {
  return (
    <>
      {children}
      <LoginModal />
      <SelectThemeModal />
      <MutterCommentModal />
      <FriendLinkApplyModal emailPlaceholder={friendLinkEmailPlaceholder} />
    </>
  )
}
