'use client'

import { X } from 'lucide-react'
import { type HTMLMotionProps, motion } from 'motion/react'
import dynamic from 'next/dynamic'
import { type FC, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/common/shadcn'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import FluidOrb from '@/ui/shadcn/fluid-orb'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/shadcn/popover'
import { FloatingMenuActionButton } from './floating-menu-action-button'

const FloatingMenuSettings = dynamic(() => import('./floating-menu-settings'))

const subscribePortal = (onStoreChange: () => void) => {
  const frame = requestAnimationFrame(onStoreChange)
  return () => cancelAnimationFrame(frame)
}

const getPortalSnapshot = () => document.body
const getServerPortalSnapshot = () => null

// TODO: 固定底部时吸附效果
// TODO: 类似 ipad cursor ?
export const DraggableFloatingMenu: FC<HTMLMotionProps<'div'>> = ({
  className,
  onDragEnd,
  onDragStart,
  ...props
}) => {
  const translations = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [orbAnimationPulse, setOrbAnimationPulse] = useState(0)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const portal = useSyncExternalStore(subscribePortal, getPortalSnapshot, getServerPortalSnapshot)

  const handleOpenChange = (nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen)
    if (nextIsOpen) setHasOpened(true)
    setOrbAnimationPulse(value => value + 1)
  }

  if (portal == null) return null

  return createPortal(
    <>
      <div
        ref={constraintsRef}
        className="pointer-events-none fixed top-20 right-4 bottom-4 left-4 sm:right-5 sm:left-5"
      />
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <motion.div
          drag={!isOpen}
          dragConstraints={constraintsRef}
          dragElastic={0.08}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 30 }}
          whileDrag={{ scale: 1.04 }}
          initial={{ scale: 0.2, y: 100, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onDragStart={(event, info) => {
            setIsDragging(true)
            onDragStart?.(event, info)
          }}
          onDragEnd={(event, info) => {
            setIsDragging(false)
            setOrbAnimationPulse(value => value + 1)
            onDragEnd?.(event, info)
          }}
          className={cn(
            'fixed bottom-[100px] left-1/2 z-100 -ml-6 size-12 touch-none select-none',
            !isOpen && 'cursor-grab active:cursor-grabbing',
            className,
          )}
          {...props}
        >
          <PopoverTrigger
            render={
              <FloatingMenuActionButton
                aria-label={
                  isOpen ? translations.common.closeQuickMenu : translations.common.openQuickMenu
                }
                className="size-12 cursor-pointer overflow-hidden border-white/70 p-0 shadow-[0_8px_20px_color-mix(in_srgb,var(--theme-accent)_35%,transparent)] dark:border-white/30 dark:shadow-[0_0_16px_rgba(255,255,255,0.14),0_10px_24px_rgba(0,0,0,0.42)]"
              />
            }
          >
            <FluidOrb
              size={48}
              color="var(--theme-accent)"
              animationPulse={orbAnimationPulse}
              isAnimating={isDragging}
              aria-hidden
            />
            <span className="absolute top-0 left-0 size-full animate-ye-ping-one-dot-one rounded-full ring-2 ring-theme-ring ring-offset-1 ring-offset-background dark:ring-white/65 dark:ring-offset-zinc-950" />
          </PopoverTrigger>
        </motion.div>

        <PopoverContent
          side="top"
          sideOffset={12}
          animation="fade"
          className="max-h-[min(38rem,calc(100dvh-7rem))] w-[min(19rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border-border/60 bg-background p-2 shadow-lg dark:border-white/12 dark:bg-zinc-950 dark:shadow-[0_20px_48px_rgba(0,0,0,0.38)]"
        >
          <div className="flex h-9 items-center justify-between px-2">
            <h2 className="font-medium text-sm">{translations.common.quickSettings}</h2>
            <button
              type="button"
              aria-label={translations.common.closeQuickMenu}
              className="flex size-7 cursor-pointer items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-theme-ring"
              onClick={() => handleOpenChange(false)}
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>

          {hasOpened && <FloatingMenuSettings />}
        </PopoverContent>
      </Popover>
    </>,
    portal,
  )
}
