import type { Friend } from './types'
import Link from 'next/link'
import { cn } from '@/lib/utils/common/shadcn'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { ViewportRevealItem } from '@/ui/components/shared/viewport-reveal-list'
import { FriendAvatarImage } from './friend-avatar-image'
import { FriendBlueprint } from './friend-blueprint'

export function FriendCard({ friend, index }: { friend: Friend; index: number }) {
  const isRightAligned = index % 2 === 1
  const translations = useTranslations()

  return (
    <ViewportRevealItem
      as="li"
      animation="blueprint"
      className={cn('flex w-[80%] md:w-[60%]', isRightAligned && 'self-end')}
    >
      <Link
        href={friend.siteUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={translations.friends.visitSite(friend.name)}
        className={cn(
          'bg-theme-background/80 hover:border-theme-accent focus-visible:outline-theme-ring motion-safe:group-data-[revealed]/viewport-reveal:animate-blueprint-card flex h-[72px] w-full items-center gap-2 rounded-xl border border-[#00000011] px-3 py-1.5 text-left text-zinc-900 transition-colors [animation-delay:var(--viewport-reveal-delay)] focus-visible:outline-2 md:h-20 md:gap-3 md:px-4 md:py-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/90 dark:hover:border-white/25 dark:hover:bg-white/[0.07]',
          isRightAligned && 'flex-row-reverse text-right',
        )}
      >
        <FriendAvatarImage avatarUrl={friend.avatarUrl} name={friend.name} />

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-zinc-900 md:text-base dark:text-white/90">
            {friend.name}
          </span>
          <span className="mt-1 block truncate text-[11px] leading-4 text-zinc-500 md:text-xs md:leading-5 dark:text-white/55">
            {friend.description}
          </span>
        </span>
      </Link>
      <FriendBlueprint
        name={friend.name}
        description={friend.description}
        isRightAligned={isRightAligned}
      />
    </ViewportRevealItem>
  )
}
