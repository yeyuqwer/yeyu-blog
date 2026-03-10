'use client'

import type { ComponentProps, FC } from 'react'
import type { Address } from 'viem'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Wallet2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { SiweMessage } from 'siwe'
import { useChainId, useChains, useConnect, useConnections, useConnectors } from 'wagmi'
import { disconnect, signMessage } from 'wagmi/actions'
import { clientEnv } from '@/config/env/client-env'
import {
  authClient,
  isEmailLoggedIn,
  isWalletLoggedIn,
  signIn,
  signOut,
  wagmiConfig,
} from '@/lib/core'
import { cn } from '@/lib/utils/common/shadcn'
import { useModalStore } from '@/store/use-modal-store'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import Loading from '@/ui/components/shared/loading'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { GitHubIcon } from './github-icon'

const adminWalletAddress = clientEnv.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS?.trim().toLowerCase()

// TODO: 钱包签名认证
// TODO: 全局状态管理存储钱包登录状态 ？
// TODO: 之后再说吧，累了，在改 bug 要猝死了🥲
export const LoginModal: FC<ComponentProps<'div'>> = () => {
  const { modalType, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'loginModal'
  const connectors = useConnectors().filter(v => v.id !== 'injected')
  const { mutate: connect, isPending } = useConnect()
  const router = useRouter()

  const connections = useConnections()
  const chainId = useChainId()
  const chains = useChains()

  const connection = connections[0]
  const isConnected = connections.length > 0
  // TODO: 这个就可以判断权限选择是否可以跳转到 /admin 了
  // TODO: 地址权限，样式不同
  // TODO: 钱包绑定 github
  const address = connection?.accounts[0]
  const currentChain = chains.find(c => c.id === chainId)

  // TODO: 封装一层
  const queryClient = useQueryClient()
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await authClient.getSession()
      return data
    },
  })
  const isWalletUser = isWalletLoggedIn({ data: session ?? null })
  const isGithubUser = isEmailLoggedIn({ data: session ?? null })

  // TODO: 普通用户登录后也要签名一次，然后存储身份信息，给予权限
  // * 现在仅使用钱包来登录后端

  // TODO: 抽取
  const isSessionAdmin =
    adminWalletAddress !== undefined &&
    session?.user?.name !== undefined &&
    session.user.name.toLowerCase() === adminWalletAddress

  const handleSignIn = useCallback(
    async (params?: { address: string; chainId: number }) => {
      const walletAddress = params?.address ?? address
      const currentChainId = params?.chainId ?? chainId

      // TODO: toast，才发觉原生的 toast 样式已经不太干净了，样式需要重写一下再添加 toast
      if (walletAddress === undefined) {
        return
      }

      try {
        const { data: nonceData, error: nonceError } = await authClient.siwe.nonce({
          walletAddress,
          chainId: currentChainId,
        })

        if (nonceError !== null || nonceData === null) {
          await disconnect(wagmiConfig)
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
          await disconnect(wagmiConfig)
          return
        }

        await queryClient.invalidateQueries({ queryKey: ['session'] })
        router.refresh()
      } catch {
        await disconnect(wagmiConfig)
      } finally {
        //
        await disconnect(wagmiConfig)
      }
    },
    [address, chainId, queryClient, router],
  )

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="rounded-xl bg-theme-background/80 backdrop-blur-xl sm:max-w-96 dark:bg-black/70">
        <DialogHeader className="">
          <DialogTitle className="text-center font-bold text-xl">
            {isConnected || isGithubUser || isWalletUser ? '用户信息' : '登录 (ゝ∀･)'}
          </DialogTitle>
        </DialogHeader>

        <main
          className={cn(
            'grid gap-4 font-mono',
            !isConnected && !isGithubUser && !isWalletUser && connectors.length > 0
              ? 'grid-cols-2'
              : 'grid-cols-1',
          )}
        >
          {isGithubUser ? (
            <div className="flex flex-col items-center justify-center gap-6 py-2">
              <div className="flex flex-col items-center gap-2">
                {session?.user?.image != null ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User Avatar'}
                    width={64}
                    height={64}
                    className="rounded-full shadow-sm"
                  />
                ) : null}
                <div className="space-y-1 text-wrap text-center">
                  <p className="font-medium text-lg">{session?.user?.name}</p>
                  <p className="text-muted-foreground text-sm">{session?.user?.email}</p>
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={async () => {
                  await disconnect(wagmiConfig).catch()
                  await signOut()
                  await queryClient.invalidateQueries({ queryKey: ['session'] })
                  router.refresh()
                }}
                className="mt-2 w-full"
              >
                退出登录
              </Button>
            </div>
          ) : isWalletUser ? (
            <div className="flex flex-col items-center justify-center gap-6 py-2">
              <div className="flex flex-col items-center gap-2">
                <AccountIcon
                  account={session?.user?.name as Address}
                  className="size-16 rounded-full shadow-sm"
                />
                <div className="space-y-1 text-center">
                  <p className="text-muted-foreground text-xs">钱包地址</p>
                  <p className="break-all font-medium text-sm">{session?.user?.name}</p>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2">
                {isSessionAdmin && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/admin" onClick={onModalClose}>
                      进入后台
                    </Link>
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await disconnect(wagmiConfig).catch()
                    await signOut()
                    await queryClient.invalidateQueries({ queryKey: ['session'] })
                    router.refresh()
                  }}
                  className="w-full"
                >
                  退出登录
                </Button>
              </div>
            </div>
          ) : isConnected ? (
            <div className="flex flex-col items-center justify-center gap-6 py-2">
              <div className="space-y-1 text-center">
                <p className="text-muted-foreground text-xs">当前网络</p>
                <p className="">{currentChain?.name ?? 'Unknown Chain'}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <Loading />
                <p className="text-muted-foreground text-sm">少女折寿中...</p>
              </div>
            </div>
          ) : (
            <>
              <Button
                type="button"
                onClick={() => signIn.social({ provider: 'github', callbackURL: '/admin' })}
                className={cn(
                  'flex cursor-pointer items-center text-base',
                  connectors.length > 0 ? 'justify-baseline' : 'justify-center',
                )}
                disabled={isPending}
              >
                <GitHubIcon className="size-5" />
                GitHub
              </Button>

              {connectors.map(connector => (
                <Button
                  key={connector.uid}
                  type="button"
                  className="justify-baseline flex cursor-pointer items-center px-3 text-base"
                  onClick={() =>
                    connect(
                      { connector },
                      {
                        onSuccess: data => {
                          handleSignIn({ address: data.accounts[0], chainId: data.chainId })
                        },
                      },
                    )
                  }
                  disabled={isPending}
                >
                  {typeof connector.icon === 'string' ? (
                    <Image
                      src={connector?.icon}
                      alt={connector?.name}
                      className="size-5"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <Wallet2 className="size-5" />
                  )}
                  {connector.name}
                </Button>
              ))}
            </>
          )}
        </main>
      </DialogContent>
    </Dialog>
  )
}
