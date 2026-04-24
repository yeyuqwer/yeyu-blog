'use client'

import type { ComponentProps, FC } from 'react'
import { useEffect, useState } from 'react'
import {
  type BrandThemeId,
  brandThemeOptions,
  resolveBrandTheme,
  setBrandTheme,
} from '@/lib/styles/themes/constant'
import { useModalStore } from '@/store/use-modal-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'

export const SelectThemeModal: FC<ComponentProps<'div'>> = () => {
  const modalType = useModalStore(s => s.modalType)
  const closeModal = useModalStore(s => s.closeModal)
  const isModalOpen = modalType === 'selectThemeModal'
  const [activeTheme, setActiveTheme] = useState<BrandThemeId>(resolveBrandTheme)

  useEffect(() => {
    if (!isModalOpen) return
    setActiveTheme(resolveBrandTheme())
  }, [isModalOpen])

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="rounded-xl bg-theme-background/80 backdrop-blur-xl sm:max-w-96 dark:bg-black/70">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">切换主题</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 pb-1 text-base">
          {brandThemeOptions.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className="cursor-pointer text-center transition-opacity hover:opacity-70"
              onClick={() => {
                setBrandTheme(id)
                setActiveTheme(id)
                closeModal()
              }}
            >
              <span className={activeTheme === id ? 'text-theme-indicator' : undefined}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
