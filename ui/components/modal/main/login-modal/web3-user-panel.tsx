import Link from 'next/link'
import { type Address, isAddress } from 'viem'
import { disconnect } from 'wagmi/actions'
import { isAdminLoggedIn, signOut, useSession, wagmiConfig } from '@/lib/core'
import { useModalStore } from '@/store/use-modal-store'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import { Button } from '@/ui/shadcn/button'

export const Web3UserPanel = () => {
  const closeModal = useModalStore(s => s.closeModal)
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
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin" onClick={closeModal}>
              进入后台
            </Link>
          </Button>
        )}
        <Button variant="destructive" onClick={handleSignOut} className="w-full">
          退出登录
        </Button>
      </div>
    </div>
  )
}
