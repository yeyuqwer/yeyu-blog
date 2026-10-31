import type { Address } from 'viem'
import { useSession } from '@/lib/core/auth/client'
import { isAdminLoggedIn } from '@/lib/core/auth/utils'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import { AdminDashboardLink } from './admin-dashboard-link'
import { LogoutButton } from './logout-button'

export const Web3UserPanel = () => {
  const { data: session } = useSession()
  const userName = session?.user?.name?.trim()
  const walletAddress = userName != null && userName.length > 0 ? (userName as Address) : undefined
  const isSessionAdmin = isAdminLoggedIn({ data: session })
  const translations = useTranslations()

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-2">
      <div className="flex flex-col items-center gap-2">
        <AccountIcon account={walletAddress} className="size-16 rounded-full shadow-sm" />
        <div className="space-y-1 text-center">
          <p className="text-muted-foreground text-xs">{translations.loginModal.walletAddress}</p>
          <p className="text-sm font-medium break-all">{walletAddress}</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        {isSessionAdmin ? <AdminDashboardLink /> : null}
        <LogoutButton />
      </div>
    </div>
  )
}
