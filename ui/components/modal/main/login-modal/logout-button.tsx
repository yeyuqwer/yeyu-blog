import { useRef } from 'react'
import { signOut, useSession } from '@/lib/core/auth/client'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LogoutIcon, type LogoutIconHandle } from '@/ui/shadcn/logout'
import { ModalActionButton } from '../modal-action-button'

export function LogoutButton() {
  const iconRef = useRef<LogoutIconHandle>(null)
  const { refetch: refetchSession } = useSession()
  const translations = useTranslations()

  const handleSignOut = async () => {
    await signOut()
    await refetchSession()
  }

  return (
    <ModalActionButton
      type="button"
      variant="outline"
      onClick={handleSignOut}
      className="h-10 w-full cursor-pointer rounded-xl border-black/10 bg-black/[0.03] px-4 text-zinc-700 hover:border-black/20 hover:bg-black/[0.06] hover:text-black focus-visible:ring-black/20 dark:border-white/12 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:border-white/25 dark:hover:bg-white/[0.12] dark:hover:text-white dark:focus-visible:ring-white/35"
      onMouseEnter={() => {
        iconRef.current?.startAnimation()
      }}
      onMouseLeave={() => {
        iconRef.current?.stopAnimation()
      }}
    >
      <LogoutIcon ref={iconRef} className="size-4" size={16} />
      {translations.loginModal.logout}
    </ModalActionButton>
  )
}
