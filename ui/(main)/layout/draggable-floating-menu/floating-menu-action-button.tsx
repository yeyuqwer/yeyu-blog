'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils/common/shadcn'

export function FloatingMenuActionButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'bg-theme-surface/80 focus-visible:ring-theme-ring/45 focus-visible:ring-offset-theme-background relative z-[60] flex size-9 items-center justify-center rounded-full border border-black/10 text-zinc-700 shadow-[0_4px_12px_rgba(24,24,27,0.08)] backdrop-blur-md transition-[color,background-color,border-color,box-shadow] duration-200 hover:border-black/20 hover:bg-white hover:text-black hover:shadow-[0_6px_16px_rgba(24,24,27,0.12)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none dark:border-white/25 dark:bg-white/12 dark:text-white dark:shadow-[0_6px_18px_rgba(0,0,0,0.32)] dark:hover:border-white/40 dark:hover:bg-white/18 dark:focus-visible:ring-white/60 dark:focus-visible:ring-offset-black',
        className,
      )}
      {...props}
    />
  )
}
