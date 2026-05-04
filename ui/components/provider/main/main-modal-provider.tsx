'use client'

import dynamic from 'next/dynamic'
import { useModalStore } from '@/store/use-modal-store'
import { FriendLinkApplyModal } from '@/ui/components/modal/main/friend-link-apply-modal'
import { MutterCommentModal } from '@/ui/components/modal/main/mutter-comment-modal'
import { SelectThemeModal } from '@/ui/components/modal/main/select-theme-modal'

const LoginModal = dynamic(
  () => import('@/ui/components/modal/main/login-modal').then(mod => mod.LoginModal),
  {
    ssr: false,
  },
)

export function MainModalProvider({
  children,
  friendLinkEmailPlaceholder,
}: {
  children: React.ReactNode
  friendLinkEmailPlaceholder?: string
}) {
  const modalType = useModalStore(s => s.modalType)

  return (
    <>
      {children}
      {modalType === 'loginModal' ? <LoginModal /> : null}
      <SelectThemeModal />
      <MutterCommentModal />
      <FriendLinkApplyModal emailPlaceholder={friendLinkEmailPlaceholder} />
    </>
  )
}
