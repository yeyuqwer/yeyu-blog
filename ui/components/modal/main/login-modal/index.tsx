'use client'

import { useSession } from '@/lib/core/auth/client'
import { isEmailLoggedIn, isWalletLoggedIn } from '@/lib/core/auth/utils'
import { useModalActions, useModalType } from '@/store/use-modal-store'
import { Modal } from '@/ui/components/interior/modal'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
import { LoginModalContent } from './content'

export const LoginModal = () => {
  const modalType = useModalType()
  const { closeModal } = useModalActions()
  const { data: session } = useSession()
  const translations = useTranslations()

  const isModalOpen = modalType === 'loginModal'
  const isLoggedIn = isEmailLoggedIn({ data: session }) || isWalletLoggedIn({ data: session })

  return (
    <Modal
      open={isModalOpen}
      onClose={closeModal}
      title={
        <LanguageText>
          {isLoggedIn ? translations.loginModal.userInfoTitle : translations.loginModal.loginTitle}
        </LanguageText>
      }
      closeLabel={translations.loginModal.closeLabel}
      maxWidth={440}
      className="border-black/10 bg-white/90 text-zinc-800 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90 dark:text-zinc-100 dark:shadow-[0_20px_48px_rgba(0,0,0,0.38)]"
      titleClassName="font-semibold text-lg text-zinc-900 tracking-tight dark:text-white"
    >
      <LoginModalContent />
    </Modal>
  )
}
