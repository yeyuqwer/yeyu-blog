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
          'flex cursor-pointer items-center text-base',
          connectors.length > 0 ? 'justify-start' : 'justify-center',
        )}
        disabled={isActionPending}
      >
        <GitHubIcon className="size-5" />
        GitHub
      </Button>

      <Button
        type="button"
        onClick={() => signIn.social({ provider: 'google', callbackURL: '/admin' })}
        className={cn(
          'flex cursor-pointer items-center text-base',
          connectors.length > 0 ? 'justify-start' : 'justify-center',
        )}
        disabled={isActionPending}
      >
        <GoogleIcon className="size-5" />
        Google
      </Button>

      {connectors.map(connector => (
        <Button
          key={connector.uid}
          type="button"
          className="flex cursor-pointer items-center justify-start px-3 text-base"
          onClick={() => handleWalletConnect(connector)}
          disabled={isActionPending}
        >
          {typeof connector.icon === 'string' ? (
            <Image
              src={connector.icon}
              alt={connector.name}
              className="size-5"
              width={20}
              height={20}
              unoptimized
            />
          ) : (
            <Wallet2 className="size-5" />
          )}
          {connector.name}
        </Button>
      ))}
    </>
  )
}
