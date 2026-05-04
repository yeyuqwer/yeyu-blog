'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useHasInjectedWallet } from '@/hooks/web3'
import { isEmailLoggedIn, isWalletLoggedIn, useSession } from '@/lib/core/auth'
import { cn } from '@/lib/utils/common/shadcn'
import { useModalStore } from '@/store/use-modal-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { LoginPanel } from './login-panel'
import { Web2UserPanel } from './web2-user-panel'

const WalletLoginSection = dynamic(
  () => import('./wallet-login-section').then(mod => mod.WalletLoginSection),
  {
    ssr: false,
  },
)

const Web3UserPanel = dynamic(() => import('./web3-user-panel').then(mod => mod.Web3UserPanel), {
  ssr: false,
})

const LoginModalContent = () => {
  const closeModal = useModalStore(s => s.closeModal)
  const hasInjectedWallet = useHasInjectedWallet()
  const [isWalletSigningIn, setIsWalletSigningIn] = useState(false)

  const { data: session } = useSession()
  const isWalletUser = isWalletLoggedIn({ data: session })
  const isEmailUser = isEmailLoggedIn({ data: session })
  const isLoginPending = isWalletSigningIn
  const hasWalletLogin = hasInjectedWallet && !isEmailUser && !isWalletUser

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="rounded-xl bg-theme-background/80 backdrop-blur-xl sm:max-w-96 dark:bg-black/70">
        <DialogHeader className="">
          <DialogTitle className="text-center font-bold text-xl">
            {isEmailUser || isWalletUser ? '用户信息' : '登录 (ゝ∀･)'}
          </DialogTitle>
        </DialogHeader>

        <main
          className={cn(
            'grid gap-3 font-mono',
            !isLoginPending && hasWalletLogin ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
          )}
        >
          {isEmailUser ? (
            <Web2UserPanel />
          ) : isWalletUser ? (
            <Web3UserPanel />
          ) : (
            <>
              {!isLoginPending ? (
                <LoginPanel hasWalletLogin={hasWalletLogin} isActionPending={isLoginPending} />
              ) : null}
              {hasWalletLogin ? (
                <WalletLoginSection
                  isLoginPending={isLoginPending}
                  setIsWalletSigningIn={setIsWalletSigningIn}
                />
              ) : null}
            </>
          )}
        </main>
      </DialogContent>
    </Dialog>
  )
}

export const LoginModal = () => {
  const modalType = useModalStore(s => s.modalType)

  if (modalType !== 'loginModal') {
    return null
  }

  return <LoginModalContent />
}
