'use client'

import { useModalActions } from '@/store/use-modal-store'
import { useTranslations } from '@/ui/components/provider/main/language-provider'

export function FriendApplyButton() {
  const { setModalOpen } = useModalActions()
  const translations = useTranslations()

  return (
    <button
      type="button"
      onClick={() => {
        setModalOpen('friendLinkApplyModal')
      }}
      className="motion-safe:animate-entry-bounce inline-flex h-9 shrink-0 cursor-pointer items-center rounded-lg border border-black/15 bg-white/65 px-3 text-sm font-medium text-zinc-800 transition-colors duration-300 ease-out [--site-entry-overshoot:-8px] hover:border-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-black dark:border-white/20 dark:bg-white/[0.07] dark:text-zinc-100 dark:hover:border-white dark:hover:bg-white dark:hover:text-black dark:focus-visible:outline-white"
    >
      {translations.friends.apply}
    </button>
  )
}
