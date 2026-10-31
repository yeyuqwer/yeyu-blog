import Image from 'next/image'
import { useSession } from '@/lib/core/auth/client'
import { isAdminLoggedIn } from '@/lib/core/auth/utils'
import { AdminDashboardLink } from './admin-dashboard-link'
import { LogoutButton } from './logout-button'

export const Web2UserPanel = () => {
  const { data: session } = useSession()
  const userImage = session?.user?.image?.trim()
  const userName = session?.user?.name?.trim()
  const userEmail = session?.user?.email?.trim()
  const isSessionAdmin = isAdminLoggedIn({ data: session })

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
        <div className="space-y-1 text-center text-wrap">
          <p className="text-lg font-medium">{userName}</p>
          {userEmail != null && userEmail.length > 0 ? (
            <p className="text-muted-foreground text-sm">{userEmail}</p>
          ) : null}
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        {isSessionAdmin ? <AdminDashboardLink /> : null}
        <LogoutButton />
      </div>
    </div>
  )
}
