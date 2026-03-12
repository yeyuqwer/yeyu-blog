'use client'

import type { ReactNode } from 'react'
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
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  isPending?: boolean
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
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description != null ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        {children}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              void onConfirm()
            }}
            disabled={isPending}
          >
            {isPending ? '稍等' : '确定'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
