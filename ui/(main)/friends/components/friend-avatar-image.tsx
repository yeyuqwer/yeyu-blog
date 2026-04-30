'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils/common/shadcn'

type FriendAvatarImageProps = {
  avatarUrl: string
  name: string
}

const avatarBlurDataUrl =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20104%20104%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23e4e4e7%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23a1a1aa%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22b%22%3E%3CfeGaussianBlur%20stdDeviation%3D%2212%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22104%22%20height%3D%22104%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%2234%22%20cy%3D%2230%22%20r%3D%2232%22%20fill%3D%22%23ffffff%22%20fill-opacity%3D%22.45%22%20filter%3D%22url(%23b)%22%2F%3E%3Ccircle%20cx%3D%2274%22%20cy%3D%2276%22%20r%3D%2236%22%20fill%3D%22%2371717a%22%20fill-opacity%3D%22.32%22%20filter%3D%22url(%23b)%22%2F%3E%3C%2Fsvg%3E'

export function FriendAvatarImage({ avatarUrl, name }: FriendAvatarImageProps) {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false)

  return (
    <span className="relative aspect-square h-full shrink-0 overflow-hidden rounded-full bg-[var(--friend-plane-avatar-bg)] ring-1 ring-[color:var(--friend-plane-inner-border)]">
      <Image
        src={avatarUrl}
        alt={name}
        fill
        sizes="(max-width: 768px) 58px, 104px"
        draggable={false}
        unoptimized
        placeholder="blur"
        blurDataURL={avatarBlurDataUrl}
        onLoad={() => {
          setIsAvatarLoaded(true)
        }}
        className={cn(
          'object-cover object-center transition-[filter,opacity,transform] duration-500 ease-out',
          isAvatarLoaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-80 blur-sm',
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.72),transparent_36%),linear-gradient(135deg,var(--friend-plane-avatar-bg),var(--friend-plane-card-highlight))] transition-opacity duration-500 dark:bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.16),transparent_38%),linear-gradient(135deg,var(--friend-plane-avatar-bg),var(--friend-plane-card-highlight))]',
          isAvatarLoaded ? 'opacity-0' : 'animate-pulse opacity-100',
        )}
      />
    </span>
  )
}
