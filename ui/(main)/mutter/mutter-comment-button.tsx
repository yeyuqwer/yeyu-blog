'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { MessageCircleIcon, type MessageCircleIconHandle } from '@/ui/shadcn/message-circle'

type MutterCommentButtonProps = {
  isActive: boolean
  commentCount: number
  onClick: () => void
}

export function MutterCommentButton({ isActive, commentCount, onClick }: MutterCommentButtonProps) {
  const iconRef = useRef<MessageCircleIconHandle>(null)
  const showCommentCount = commentCount > 0

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
      aria-label="open comment modal"
      aria-pressed={isActive}
      className={cn(
        'inline-flex h-8 cursor-pointer items-center justify-center gap-0.5 rounded-md px-1.5 text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-zinc-500 dark:hover:text-zinc-200',
        isActive && 'text-zinc-700 dark:text-zinc-200',
      )}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MessageCircleIcon
        ref={iconRef}
        aria-hidden="true"
        className="flex size-4 shrink-0 items-center justify-center [&_svg]:block"
        size={16}
      />
      <span
        aria-hidden={!showCommentCount}
        className={cn(
          'flex h-4 min-w-[1.5ch] items-center justify-center font-medium text-[11px] tabular-nums leading-none',
          !showCommentCount && 'invisible',
        )}
      >
        {showCommentCount ? commentCount : null}
      </span>
    </button>
  )
}
