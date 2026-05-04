import Image from 'next/image'
import Link from 'next/link'
import { disconnect } from 'wagmi/actions'
import { isAdminLoggedIn, signOut, useSession, wagmiConfig } from '@/lib/core'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'

export const Web2UserPanel = () => {
  const closeModal = useModalStore(s => s.closeModal)
  const { data: session, refetch: refetchSession } = useSession()
  const userImage = session?.user?.image?.trim()
  const userName = session?.user?.name?.trim()
  const userEmail = session?.user?.email?.trim()
  const isSessionAdmin = isAdminLoggedIn({ data: session })

  const handleSignOut = async () => {
    await disconnect(wagmiConfig)
    await signOut()
    await refetchSession()
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-2">
      <div className="flex flex-col items-center gap-2">
        {userImage != null && userImage.length > 0 && userName != null ? (
          <Image
            src={userImage}
            alt={userName}
            width={64}
            height={64}
            className="rounded-full shadow-sm"
            unoptimized
          />
        ) : null}
        <div className="space-y-1 text-wrap text-center">
          <p className="font-medium text-lg">{userName}</p>
          {userEmail != null && userEmail.length > 0 ? (
            <p className="text-muted-foreground text-sm">{userEmail}</p>
          ) : null}
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
