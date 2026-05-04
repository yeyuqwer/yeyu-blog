import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { signOut, useSession } from '@/lib/core/auth/client'
import { isAdminLoggedIn } from '@/lib/core/auth/utils'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { LayoutGridIcon, type LayoutGridIconHandle } from '@/ui/shadcn/layout-grid'
import { LogoutIcon, type LogoutIconHandle } from '@/ui/shadcn/logout'

export const Web2UserPanel = () => {
  const closeModal = useModalStore(s => s.closeModal)
  const adminIconRef = useRef<LayoutGridIconHandle>(null)
  const logoutIconRef = useRef<LogoutIconHandle>(null)
  const { data: session, refetch: refetchSession } = useSession()
  const userImage = session?.user?.image?.trim()
  const userName = session?.user?.name?.trim()
  const userEmail = session?.user?.email?.trim()
  const isSessionAdmin = isAdminLoggedIn({ data: session })

  const handleSignOut = async () => {
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
