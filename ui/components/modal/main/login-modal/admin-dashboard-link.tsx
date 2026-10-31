import Link from 'next/link'
import { useRef } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { useModalActions } from '@/store/use-modal-store'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
import { buttonVariants } from '@/ui/shadcn/button'
import { LayoutGridIcon, type LayoutGridIconHandle } from '@/ui/shadcn/layout-grid'

export function AdminDashboardLink() {
  const { closeModal } = useModalActions()
  const iconRef = useRef<LayoutGridIconHandle>(null)
  const translations = useTranslations()

  return (
    <Link
      href="/admin"
      onClick={closeModal}
      className={cn(
        buttonVariants(),
        'h-10 w-full cursor-pointer rounded-xl bg-black px-4 text-white shadow-none hover:bg-zinc-800 hover:text-white hover:shadow-none focus-visible:border-black focus-visible:ring-black/25 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:hover:text-black dark:focus-visible:border-white dark:focus-visible:ring-white/35',
      )}
      onMouseEnter={() => {
        iconRef.current?.startAnimation()
      }}
      onMouseLeave={() => {
        iconRef.current?.stopAnimation()
      }}
    >
      <LayoutGridIcon ref={iconRef} className="size-4" size={16} />
      <LanguageText>{translations.loginModal.adminDashboard}</LanguageText>
    </Link>
  )
}
