import type { Dispatch, SetStateAction } from 'react'
import type { useInjectedWalletConnection } from '@/hooks/web3/use-injected-wallet'
import type { InjectedWallet, InjectedWalletProvider } from '@/lib/core/web3/injected-wallet'
import { Wallet2 } from 'lucide-react'
import Image from 'next/image'
import { getAddress } from 'viem'
import { createSiweMessage } from 'viem/siwe'
import { authClient, useSession } from '@/lib/core/auth/client'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { Button } from '@/ui/shadcn/button'

export const WalletLoginPanel = ({
  injectedWallet,
  isLoginPending,
  setIsWalletSigningIn,
}: {
  injectedWallet: ReturnType<typeof useInjectedWalletConnection>
  isLoginPending: boolean
  setIsWalletSigningIn: Dispatch<SetStateAction<boolean>>
}) => {
  const isActionPending = injectedWallet.isConnecting || isLoginPending
  const translations = useTranslations()

  const { refetch: refetchSession } = useSession()

  const handleSignIn = async ({
    address: walletAddress,
    chainId: currentChainId,
    provider,
  }: {
    address: string
    chainId: number
    provider: InjectedWalletProvider
  }) => {
    const checksumWalletAddress = getAddress(walletAddress)

    const { data: nonceData, error: nonceError } = await authClient.siwe.nonce()

    if (nonceError !== null || nonceData === null) {
      return
    }

    const message = createSiweMessage({
      domain: window.location.host,
      address: checksumWalletAddress,
      statement: translations.loginModal.walletSignInStatement,
      uri: window.location.origin,
      version: '1',
      chainId: currentChainId,
      nonce: nonceData.nonce,
    })

    const signature = await injectedWallet.signMessage({
      account: walletAddress,
      message,
      provider,
    })

    const { data: verifyData, error: verifyError } = await authClient.siwe.verify({
      message,
      signature,
    })

    if (verifyError !== null || verifyData === null) {
      return
    }

    await refetchSession()
  }

  const handleWalletConnect = async (wallet: InjectedWallet) => {
    setIsWalletSigningIn(true)

    await (async () => {
      const connectedWallet = await injectedWallet.connect(wallet)

      if (connectedWallet === undefined) {
        return
      }

      await handleSignIn({
        address: connectedWallet.account,
        chainId: connectedWallet.chainId,
        provider: connectedWallet.provider,
      })
    })().finally(() => {
      setIsWalletSigningIn(false)
    })
  }

  return (
    <>
      {injectedWallet.wallets.map(wallet => (
        <Button
          key={wallet.id}
          type="button"
          className="h-10 min-w-0 cursor-pointer justify-start rounded-xl border-black/10 bg-black/[0.03] px-3 text-sm text-zinc-800 hover:border-black/20 hover:bg-black/[0.06] hover:text-black focus-visible:ring-black/20 disabled:cursor-not-allowed dark:border-white/12 dark:bg-white/[0.06] dark:text-zinc-100 dark:hover:border-white/25 dark:hover:bg-white/[0.12] dark:hover:text-white dark:focus-visible:ring-white/35"
          onClick={() => handleWalletConnect(wallet)}
          disabled={isActionPending}
        >
          {wallet.icon !== undefined ? (
            <Image
              src={wallet.icon}
              alt=""
              className="size-5 shrink-0 rounded-full"
              width={20}
              height={20}
              unoptimized
            />
          ) : (
            <Wallet2 className="size-5 shrink-0" />
          )}
          <span className="truncate">{wallet.name}</span>
        </Button>
      ))}
    </>
  )
}
