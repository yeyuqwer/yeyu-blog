'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'

export function MainConfirmModal({
  contentClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
  cancelButtonClassName,
  confirmButtonClassName,
  cancelButtonVariant = 'outline',
  confirmButtonVariant = 'default',
  ...props
}: ComponentProps<typeof ConfirmDialog>) {
  return (
    <ConfirmDialog
      {...props}
      cancelButtonVariant={cancelButtonVariant}
      confirmButtonVariant={confirmButtonVariant}
      contentClassName={cn(
        'rounded-xl border-theme-border/70 bg-theme-background/85 text-theme-primary shadow-[0_18px_54px_color-mix(in_srgb,var(--theme-indicator)_14%,transparent)] backdrop-blur-xl sm:max-w-[420px] dark:border-theme-400/20 dark:bg-[color-mix(in_srgb,var(--theme-950)_74%,black)] dark:text-theme-100 dark:shadow-[0_18px_60px_rgba(0,0,0,0.38)]',
        contentClassName,
      )}
      titleClassName={cn('text-center font-bold text-theme-primary text-xl', titleClassName)}
      descriptionClassName={cn(
        'text-center text-theme-muted-foreground dark:text-theme-200/75',
        descriptionClassName,
      )}
      footerClassName={cn('gap-2 sm:gap-3', footerClassName)}
      cancelButtonClassName={cn(
        'h-10 cursor-pointer rounded-xl border-theme-border/70 bg-theme-surface/50 px-4 text-theme-primary shadow-none hover:border-theme-indicator/40 hover:bg-theme-hover-background/70 hover:text-theme-primary focus-visible:ring-theme-ring/25 dark:border-theme-400/20 dark:bg-theme-950/35 dark:text-theme-100 dark:hover:bg-theme-900/45 dark:hover:text-theme-50',
        cancelButtonClassName,
      )}
      confirmButtonClassName={cn(
        'h-10 cursor-pointer rounded-xl bg-theme-indicator px-4 text-theme-active-text shadow-[0_10px_24px_color-mix(in_srgb,var(--theme-indicator)_26%,transparent)] hover:bg-[color-mix(in_srgb,var(--theme-indicator)_92%,black)] hover:text-theme-active-text focus-visible:ring-theme-ring/35 disabled:cursor-not-allowed disabled:bg-theme-indicator disabled:text-theme-active-text disabled:opacity-45',
        confirmButtonClassName,
      )}
    />
  )
}
