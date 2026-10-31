'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { useHasInjectedWallet } from '@/hooks/web3/use-has-injected-wallet'
import { useSession } from '@/lib/core/auth/client'
import { isEmailLoggedIn, isWalletLoggedIn } from '@/lib/core/auth/utils'
import { cn } from '@/lib/utils/common/shadcn'
import { LoginPanel } from './login-panel'
import { WalletLoginSection } from './wallet-login-section'
import { Web2UserPanel } from './web2-user-panel'
import { Web3UserPanel } from './web3-user-panel'

export const LoginModalContent = () => {
  const reducedMotion = useReducedMotion()
  const hasInjectedWallet = useHasInjectedWallet()
  const [isWalletSigningIn, setIsWalletSigningIn] = useState(false)

  const { data: session } = useSession()
  const isWalletUser = isWalletLoggedIn({ data: session })
  const isEmailUser = isEmailLoggedIn({ data: session })
  const isLoginPending = isWalletSigningIn
  const hasWalletLogin = hasInjectedWallet && !isEmailUser && !isWalletUser
  const contentKey = isEmailUser ? 'email-user' : isWalletUser ? 'wallet-user' : 'login'

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={contentKey}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
        transition={{ duration: reducedMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
        aria-busy={isLoginPending}
        className={cn(
          'motion-safe:[&>button]:animate-entry-text grid gap-3 font-mono [&>button]:[animation-duration:300ms] [&>button:nth-child(2)]:[animation-delay:35ms] [&>button:nth-child(3)]:[animation-delay:70ms] [&>button:nth-child(4)]:[animation-delay:105ms]',
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
      </motion.div>
    </AnimatePresence>
  )
}
