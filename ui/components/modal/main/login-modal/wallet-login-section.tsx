import type { Dispatch, SetStateAction } from 'react'
import { useInjectedWallet } from '@/hooks/web3'
import { LoginPendingPanel } from './login-pending-panel'
import { WalletLoginPanel } from './wallet-login-panel'

export const WalletLoginSection = ({
  isLoginPending,
  setIsWalletSigningIn,
}: {
  isLoginPending: boolean
  setIsWalletSigningIn: Dispatch<SetStateAction<boolean>>
}) => {
  const injectedWallet = useInjectedWallet()

  if (isLoginPending) {
    return <LoginPendingPanel />
  }

  return (
    <WalletLoginPanel
      injectedWallet={injectedWallet}
      isLoginPending={isLoginPending}
      setIsWalletSigningIn={setIsWalletSigningIn}
    />
  )
}
