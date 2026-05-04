'use client'

import { useEffect, useState } from 'react'
import { useConnections, useConnectors, WagmiProvider } from 'wagmi'
import { disconnect } from 'wagmi/actions'
import { isEmailLoggedIn, isWalletLoggedIn, useSession } from '@/lib/core/auth'
import { wagmiConfig } from '@/lib/core/web3'
import { cn } from '@/lib/utils/common/shadcn'
import { useModalStore } from '@/store/use-modal-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { LoginPanel } from './login-panel'
import { LoginPendingPanel } from './login-pending-panel'
import { Web2UserPanel } from './web2-user-panel'
import { Web3UserPanel } from './web3-user-panel'

// TODO: 全局状态管理存储钱包登录状态 ？
// TODO: 之后再说吧，累了，在改 bug 要猝死了🥲
const LoginModalContent = () => {
  const modalType = useModalStore(s => s.modalType)
  const closeModal = useModalStore(s => s.closeModal)
  const isModalOpen = modalType === 'loginModal'

  const connectors = useConnectors().filter(v => v.id !== 'injected')
  const [isWalletSigningIn, setIsWalletSigningIn] = useState(false)

  const connections = useConnections()

  const isConnected = connections.length > 0

  const { data: session } = useSession()
  const isWalletUser = isWalletLoggedIn({ data: session })
  const isEmailUser = isEmailLoggedIn({ data: session })
  const isLoginPending = isWalletSigningIn

  useEffect(() => {
    if (!isModalOpen || !isConnected || isWalletUser || isWalletSigningIn) {
      return
    }

    disconnect(wagmiConfig)
  }, [isConnected, isModalOpen, isWalletSigningIn, isWalletUser])

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="rounded-xl bg-theme-background/80 backdrop-blur-xl sm:max-w-96 dark:bg-black/70">
        <DialogHeader className="">
          <DialogTitle className="text-center font-bold text-xl">
            {isEmailUser || isWalletUser ? '用户信息' : '登录 (ゝ∀･)'}
          </DialogTitle>
        </DialogHeader>

        <main
          className={cn(
            'grid gap-3 font-mono',
            !isLoginPending && !isEmailUser && !isWalletUser && connectors.length > 0
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1',
          )}
        >
          {isEmailUser ? (
            <Web2UserPanel />
          ) : isWalletUser ? (
            <Web3UserPanel />
          ) : isLoginPending ? (
            <LoginPendingPanel />
          ) : (
            <LoginPanel
              isLoginPending={isLoginPending}
              setIsWalletSigningIn={setIsWalletSigningIn}
            />
          )}
        </main>
      </DialogContent>
    </Dialog>
  )
}

export const LoginModal = () => {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <LoginModalContent />
    </WagmiProvider>
  )
}
