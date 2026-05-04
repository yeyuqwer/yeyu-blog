import type { Dispatch, SetStateAction } from 'react'
import { Wallet2 } from 'lucide-react'
import Image from 'next/image'
import { SiweMessage } from 'siwe'
import { useConnect, useConnections, useConnectors } from 'wagmi'
import { disconnect, signMessage } from 'wagmi/actions'
import { authClient, signIn, useSession } from '@/lib/core/auth'
import { wagmiConfig } from '@/lib/core/web3'
import { cn } from '@/lib/utils/common/shadcn'
import { Button } from '@/ui/shadcn/button'
import { GitHubIcon } from './assets/github-icon'
import { GoogleIcon } from './assets/google-icon'

const loginPanelButtonClassName =
  'h-10 min-w-0 cursor-pointer rounded-xl border-theme-border/70 bg-theme-surface/50 px-4 text-theme-primary text-sm hover:border-theme-indicator/40 hover:bg-theme-hover-background/70 hover:text-theme-primary focus-visible:ring-theme-ring/25 disabled:cursor-not-allowed dark:border-theme-400/20 dark:bg-theme-950/35 dark:text-theme-100 dark:hover:bg-theme-900/45 dark:hover:text-theme-50'

export const LoginPanel = ({
  isLoginPending,
  setIsWalletSigningIn,
}: {
  isLoginPending: boolean
  setIsWalletSigningIn: Dispatch<SetStateAction<boolean>>
}) => {
  const connectors = useConnectors().filter(v => v.id !== 'injected')
  const { isPending, mutateAsync: connectAsync } = useConnect()

  const isConnected = useConnections().length > 0
  const isActionPending = isPending || isLoginPending

  const { refetch: refetchSession } = useSession()

  const handleSignIn = async ({
    address: walletAddress,
    chainId: currentChainId,
  }: {
    address: string
    chainId: number
  }) => {
    const { data: nonceData, error: nonceError } = await authClient.siwe.nonce({
      walletAddress,
      chainId: currentChainId,
    })

    if (nonceError !== null || nonceData === null) {
      return
    }

    const siweMessage = new SiweMessage({
      domain: window.location.host,
      address: walletAddress,
      statement: 'Sign in with Ethereum to the useyeyu.cc',
      uri: window.location.origin,
      version: '1',
      chainId: currentChainId,
      nonce: nonceData.nonce,
    })

    const message = siweMessage.prepareMessage()
    const signature = await signMessage(wagmiConfig, { message })

    const { data: verifyData, error: verifyError } = await authClient.siwe.verify({
      message,
      signature,
      walletAddress,
      chainId: currentChainId,
    })

    if (verifyError !== null || verifyData === null) {
      return
    }

    await refetchSession()
  }

  const handleWalletConnect = async (connector: (typeof connectors)[number]) => {
    setIsWalletSigningIn(true)

    await (async () => {
      if (isConnected) {
        await disconnect(wagmiConfig)
      }

      const data = await connectAsync({ connector })
      const [walletAddress] = data.accounts

      if (walletAddress === undefined) {
        return
      }

      await handleSignIn({ address: walletAddress, chainId: data.chainId })
    })().finally(async () => {
      setIsWalletSigningIn(false)
      await disconnect(wagmiConfig)
    })
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => signIn.social({ provider: 'github', callbackURL: '/admin' })}
        className={cn(
          loginPanelButtonClassName,
          connectors.length > 0 ? 'justify-start' : 'justify-center',
        )}
        disabled={isActionPending}
      >
        <GitHubIcon className="size-5 shrink-0" />
        <span className="truncate">GitHub</span>
      </Button>

      <Button
        type="button"
        onClick={() => signIn.social({ provider: 'google', callbackURL: '/admin' })}
        className={cn(
          loginPanelButtonClassName,
          connectors.length > 0 ? 'justify-start' : 'justify-center',
        )}
        disabled={isActionPending}
      >
        <GoogleIcon className="size-5 shrink-0" />
        <span className="truncate">Google</span>
      </Button>

      {connectors.map(connector => (
        <Button
          key={connector.uid}
          type="button"
          className={cn(loginPanelButtonClassName, 'justify-start px-3')}
          onClick={() => handleWalletConnect(connector)}
          disabled={isActionPending}
        >
          {typeof connector.icon === 'string' ? (
            <Image
              src={connector.icon}
              alt={connector.name}
              className="size-5 shrink-0"
              width={20}
              height={20}
              unoptimized
            />
          ) : (
            <Wallet2 className="size-5 shrink-0" />
          )}
          <span className="truncate">{connector.name}</span>
        </Button>
      ))}
    </>
  )
}
