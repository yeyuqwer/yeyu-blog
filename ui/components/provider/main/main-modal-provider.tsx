'use client'

import {
  FriendLinkApplyModal,
  LoginModal,
  MutterCommentModal,
  SelectThemeModal,
} from '@/ui/components/modal/main'

export function MainModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LoginModal />
      <SelectThemeModal />
      <MutterCommentModal />
      <FriendLinkApplyModal />
    </>
  )
}
