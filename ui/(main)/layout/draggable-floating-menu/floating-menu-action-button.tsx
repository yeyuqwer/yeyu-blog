'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils/common/shadcn'

export function FloatingMenuActionButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'focus-visible:ring-theme-ring/45 relative z-[60] flex size-9 items-center justify-center rounded-full border border-white/55 bg-white/25 text-zinc-800 shadow-[0_4px_16px_-6px_rgba(24,24,27,0.18),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-lg backdrop-saturate-150 transition-[color,background-color,border-color,box-shadow] duration-200 hover:bg-white/45 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none dark:border-white/20 dark:bg-zinc-900/25 dark:text-white/85 dark:hover:bg-white/15',
        className,
      )}
      {...props}
    />
  )
}
