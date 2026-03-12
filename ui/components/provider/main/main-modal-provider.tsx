'use client'

import { LoginModal } from '../../modal/login-modal'
import MutterCommentModal from '../../modal/mutter-comment-modal'
import { SelectThemeModal } from '../../modal/select-theme-modal'

export function MainModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LoginModal />
      <SelectThemeModal />
      <MutterCommentModal />
    </>
  )
}
