'use client'

import {
  FriendLinkApplyModal,
  LoginModal,
  MutterCommentModal,
  SelectThemeModal,
} from '@/ui/components/modal/main'

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
