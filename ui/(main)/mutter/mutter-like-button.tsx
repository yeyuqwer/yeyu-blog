'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { HeartIcon, type HeartIconHandle } from '@/ui/shadcn/heart'

type MutterLikeButtonProps = {
  isLiked: boolean
  likeCount: number
  onClick: () => void
}

export function MutterLikeButton({ isLiked, likeCount, onClick }: MutterLikeButtonProps) {
  const iconRef = useRef<HeartIconHandle>(null)
  const showLikeCount = likeCount > 0

  const handleMouseEnter = () => {
    if (iconRef.current != null) {
      iconRef.current.startAnimation()
    }
  }

  const handleMouseLeave = () => {
    if (iconRef.current != null) {
      iconRef.current.stopAnimation()
    }
  }

  return (
    <button
      type="button"
      aria-label="like mutter"
      aria-pressed={isLiked}
      className={cn(
        'inline-flex h-8 cursor-pointer items-center justify-center gap-0.5 rounded-md px-1.5 text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-zinc-500 dark:hover:text-zinc-200',
        isLiked && 'text-rose-500 hover:text-rose-500 dark:text-rose-500',
      )}
      disabled={isLiked}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <HeartIcon
        ref={iconRef}
        aria-hidden="true"
        className={cn(
          'flex size-4 shrink-0 items-center justify-center transition-colors [&_svg]:block',
          isLiked && 'text-rose-500 [&_svg]:fill-rose-500',
        )}
        size={16}
      />
      <span
        aria-hidden={!showLikeCount}
        className={cn(
          'flex h-4 min-w-[1.5ch] items-center justify-center font-medium text-[11px] tabular-nums leading-none',
          !showLikeCount && 'invisible',
        )}
      >
        {showLikeCount ? likeCount : null}
      </span>
    </button>
  )
}
