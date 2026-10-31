'use client'

import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { Modal } from '@/ui/components/interior/modal'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { Button } from '@/ui/shadcn/button'

export function MainConfirmModal({
  contentClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
  cancelButtonClassName,
  confirmButtonClassName,
  cancelButtonVariant = 'outline',
  confirmButtonVariant = 'default',
  open,
  onClose,
  onConfirm,
  title,
  description,
  children,
  isPending = false,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  isPending?: boolean
  contentClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  footerClassName?: string
  cancelButtonClassName?: string
  confirmButtonClassName?: string
  cancelButtonVariant?: ComponentProps<typeof Button>['variant']
  confirmButtonVariant?: ComponentProps<typeof Button>['variant']
}) {
  const translations = useTranslations()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button
            type="button"
            variant={cancelButtonVariant}
            onClick={onClose}
            disabled={isPending}
            className={cn(
              'h-9 cursor-pointer rounded-lg border-black/20 bg-black/[0.03] px-3 text-black shadow-none hover:border-black/35 hover:bg-black/[0.08] hover:text-black focus-visible:ring-black/25 dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/[0.12] dark:hover:text-white dark:focus-visible:ring-white/30',
              cancelButtonClassName,
            )}
          >
            {translations.common.cancel}
          </Button>
          <Button
            type="button"
            variant={confirmButtonVariant}
            onClick={() => {
              void onConfirm()
            }}
            disabled={isPending}
            className={cn(
              'h-9 cursor-pointer rounded-lg bg-black px-3 text-white shadow-[0_8px_18px_rgba(0,0,0,0.2)] hover:bg-zinc-800 hover:text-white focus-visible:ring-black/25 disabled:cursor-not-allowed disabled:bg-black disabled:text-white disabled:opacity-45 dark:bg-white dark:text-black dark:shadow-[0_8px_18px_rgba(0,0,0,0.3)] dark:hover:bg-zinc-200 dark:hover:text-black dark:focus-visible:ring-white/30 dark:disabled:bg-white dark:disabled:text-black',
              confirmButtonClassName,
            )}
          >
            {isPending ? translations.common.pending : translations.common.confirm}
          </Button>
        </>
      }
      closeLabel={translations.common.closeConfirmDialog}
      maxWidth={420}
      className={cn(
        'rounded-xl border-black/15 bg-white/95 text-black shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:max-w-[420px] dark:border-white/20 dark:bg-black/95 dark:text-white dark:shadow-[0_18px_60px_rgba(0,0,0,0.42)]',
        contentClassName,
      )}
      titleClassName={cn(
        'text-center text-xl font-bold text-black dark:text-white',
        titleClassName,
      )}
      descriptionClassName={cn(
        'text-center text-black/60 dark:text-white/60',
        descriptionClassName,
      )}
      footerClassName={cn('gap-2 border-black/15 sm:gap-3 dark:border-white/15', footerClassName)}
    >
      {children}
    </Modal>
  )
}
