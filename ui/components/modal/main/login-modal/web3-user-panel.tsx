import Link from 'next/link'
import { useRef } from 'react'
import { type Address, isAddress } from 'viem'
import { disconnect } from 'wagmi/actions'
import { isAdminLoggedIn, signOut, useSession } from '@/lib/core/auth'
import { wagmiConfig } from '@/lib/core/web3'
import { useModalStore } from '@/store/use-modal-store'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import { Button } from '@/ui/shadcn/button'
import { LayoutGridIcon, type LayoutGridIconHandle } from '@/ui/shadcn/layout-grid'
import { LogoutIcon, type LogoutIconHandle } from '@/ui/shadcn/logout'

export const Web3UserPanel = () => {
  const closeModal = useModalStore(s => s.closeModal)
  const adminIconRef = useRef<LayoutGridIconHandle>(null)
  const logoutIconRef = useRef<LogoutIconHandle>(null)
  const { data: session, refetch: refetchSession } = useSession()
  const userName = session?.user?.name
  const walletAddress = userName != null && isAddress(userName) ? (userName as Address) : undefined
  const isSessionAdmin = isAdminLoggedIn({ data: session })

  const handleSignOut = async () => {
    await disconnect(wagmiConfig)
    await signOut()
    await refetchSession()
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-2">
      <div className="flex flex-col items-center gap-2">
        <AccountIcon account={walletAddress} className="size-16 rounded-full shadow-sm" />
        <div className="space-y-1 text-center">
          <p className="text-muted-foreground text-xs">钱包地址</p>
          <p className="break-all font-medium text-sm">{walletAddress}</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        {isSessionAdmin && (
          <Button
            asChild
            className="h-10 w-full cursor-pointer rounded-xl bg-theme-indicator px-4 text-theme-active-text hover:bg-[color-mix(in_srgb,var(--theme-indicator)_92%,black)] hover:text-theme-active-text focus-visible:ring-theme-ring/35"
            onMouseEnter={() => {
              adminIconRef.current?.startAnimation()
            }}
            onMouseLeave={() => {
              adminIconRef.current?.stopAnimation()
            }}
          >
            <Link href="/admin" onClick={closeModal}>
              <LayoutGridIcon ref={adminIconRef} className="size-4" size={16} />
              进入后台
            </Link>
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="h-10 w-full cursor-pointer rounded-xl border-destructive/25 bg-destructive/5 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/25 dark:border-destructive/30 dark:bg-destructive/10"
          onMouseEnter={() => {
            logoutIconRef.current?.startAnimation()
          }}
          onMouseLeave={() => {
            logoutIconRef.current?.stopAnimation()
          }}
        >
          <LogoutIcon ref={logoutIconRef} className="size-4" size={16} />
          退出登录
        </Button>
      </div>
    </div>
  )
}
