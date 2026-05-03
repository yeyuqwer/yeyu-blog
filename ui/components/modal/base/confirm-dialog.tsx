'use client'

import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { Button } from '@/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  children,
  isPending = false,
  contentClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
  cancelButtonClassName,
  confirmButtonClassName,
  cancelButtonVariant = 'outline',
  confirmButtonVariant = 'destructive',
  cancelText = '取消',
  confirmText = '确定',
  pendingText = '稍等',
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
  cancelText?: ReactNode
  confirmText?: ReactNode
  pendingText?: ReactNode
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!nextOpen) {
          onClose()
        }
      }}
    >
      <DialogContent className={cn('flex flex-col gap-4', contentClassName)}>
        <DialogHeader>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          {description != null ? (
            <DialogDescription className={descriptionClassName}>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {children}

        <div className={cn('flex justify-end gap-2', footerClassName)}>
          <Button
            variant={cancelButtonVariant}
            onClick={onClose}
            disabled={isPending}
            className={cancelButtonClassName}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={() => {
              void onConfirm()
            }}
            disabled={isPending}
            className={confirmButtonClassName}
          >
            {isPending ? pendingText : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
