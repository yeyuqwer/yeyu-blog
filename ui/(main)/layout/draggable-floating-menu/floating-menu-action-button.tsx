'use client'

import type { HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'

export function FloatingMenuActionButton({
  children,
  className,
  isActive = false,
  showPing = false,
  ...props
}: HTMLMotionProps<'div'> & {
  children?: ReactNode
  isActive?: boolean
  showPing?: boolean
}) {
  return (
    <motion.div
      className={cn(
        'relative flex size-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-zinc-500 shadow-[0_10px_24px_rgba(24,24,27,0.1)] ring-1 ring-zinc-950/5 backdrop-blur-xl transition-[color,background-color,border-color,box-shadow] duration-300 dark:border-neutral-800 dark:bg-black dark:text-neutral-500 dark:shadow-sm dark:ring-0',
        className,
        isActive
          ? 'border-theme-primary/35 bg-theme-surface text-theme-primary shadow-[0_12px_28px_color-mix(in_srgb,var(--theme-primary)_18%,transparent)] ring-theme-primary/20 dark:border-neutral-800 dark:bg-black dark:text-white dark:shadow-sm dark:ring-0'
          : 'text-zinc-500 dark:text-neutral-500',
      )}
      {...props}
    >
      {showPing && (
        <span className="absolute inset-0 animate-ye-ping-one-dot-one rounded-full ring-2 ring-theme-indicator/70 ring-offset-2 ring-offset-theme-100 dark:ring-white dark:ring-offset-black" />
      )}
      {children}
    </motion.div>
  )
}
