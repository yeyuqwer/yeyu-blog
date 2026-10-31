'use client'

import { Plus } from 'lucide-react'
import { type HTMLMotionProps, motion } from 'motion/react'
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import { playTap } from '@/lib/core/sound/bencho-sounds'
import { cn } from '@/lib/utils/common/shadcn'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import FluidOrb from '@/ui/shadcn/fluid-orb'
import { FloatingMenuActionButton } from './floating-menu-action-button'
import RadialMenuActions, { radialOffsets } from './radial-menu-actions'

const subscribePortal = (onStoreChange: () => void) => {
  const frame = requestAnimationFrame(onStoreChange)
  return () => cancelAnimationFrame(frame)
}

const getPortalSnapshot = () => document.body
const getServerPortalSnapshot = () => null

export function DraggableFloatingMenu({
  className,
  onDragEnd,
  onDragStart,
  ...props
}: HTMLMotionProps<'div'>) {
  const translations = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [isSkyOpen, setIsSkyOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [aim, setAim] = useState<number | null>(null)
  const [orbAnimationPulse, setOrbAnimationPulse] = useState(0)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const aimRef = useRef<number | null>(null)
  const draggedRef = useRef(false)
  const ignoreClickRef = useRef(false)
  const focusOnOpenRef = useRef(false)
  const gestureRef = useRef<{ pointerId: number; x: number; y: number; moved: boolean } | null>(
    null,
  )
  const menuId = useId()
  const portal = useSyncExternalStore(subscribePortal, getPortalSnapshot, getServerPortalSnapshot)

  const handleAimChange = useCallback((nextAim: number | null) => {
    aimRef.current = nextAim
    setAim(nextAim)
  }, [])

  const handleOpenChange = useCallback((nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen)
    if (nextIsOpen) setHasOpened(true)
    if (!nextIsOpen) {
      setIsSkyOpen(false)
      setAim(null)
      aimRef.current = null
      gestureRef.current = null
    }
    setOrbAnimationPulse(value => value + 1)
  }, [])

  const handleSelect = () => {
    handleOpenChange(false)
    triggerRef.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    if (!isOpen) return

    if (focusOnOpenRef.current) {
      focusOnOpenRef.current = false
      rootRef.current?.querySelector<HTMLButtonElement>('[data-radial-option]')?.focus()
    }

    const handleOutsidePress = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return
      if (rootRef.current?.contains(event.target) || panelRef.current?.contains(event.target)) {
        return
      }
      handleOpenChange(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || isSkyOpen) return
      event.preventDefault()
      handleOpenChange(false)
      triggerRef.current?.focus({ preventScroll: true })
    }

    document.addEventListener('pointerdown', handleOutsidePress)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePress)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handleOpenChange, isOpen, isSkyOpen])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (
      isSkyOpen ||
      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)
    ) {
      return
    }
    event.preventDefault()

    if (!isOpen) {
      focusOnOpenRef.current = true
      playTap()
      handleOpenChange(true)
      return
    }

    const options = rootRef.current?.querySelectorAll<HTMLButtonElement>('[data-radial-option]')
    if (!options?.length) return
    const currentIndex = Array.from(options).findIndex(option => option === document.activeElement)
    let nextIndex = 0
    if (event.key === 'End') {
      nextIndex = options.length - 1
    } else if (event.key !== 'Home') {
      const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1
      nextIndex = (currentIndex + direction + options.length) % options.length
    }
    options[nextIndex]?.focus()
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return
    draggedRef.current = false
    ignoreClickRef.current = false
    if (!isOpen || isSkyOpen) return

    gestureRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const gesture = gestureRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) return
    const dx = event.clientX - gesture.x
    const dy = event.clientY - gesture.y
    if (Math.hypot(dx, dy) < 14) {
      handleAimChange(null)
      return
    }
    gesture.moved = true
    if (dy > 24) {
      handleAimChange(null)
      return
    }

    const distances = radialOffsets.map(offset => Math.hypot(dx - offset.x, dy - offset.y))
    handleAimChange(distances.indexOf(Math.min(...distances)))
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const gesture = gestureRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) return
    gestureRef.current = null
    if (!gesture.moved) return

    ignoreClickRef.current = true
    if (aimRef.current !== null) {
      const options = rootRef.current?.querySelectorAll<HTMLButtonElement>('[data-radial-option]')
      options?.[aimRef.current]?.click()
    }
    handleAimChange(null)
  }

  const cancelGesture = () => {
    if (!gestureRef.current) return
    gestureRef.current = null
    ignoreClickRef.current = true
    handleAimChange(null)
  }

  if (portal == null) return null

  return createPortal(
    <>
      <div
        ref={constraintsRef}
        className="pointer-events-none fixed top-40 right-[108px] bottom-14 left-[108px]"
      />
      <motion.div
        ref={rootRef}
        drag={!isOpen}
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        whileDrag={{ scale: 1.02 }}
        onDragStart={(event, info) => {
          draggedRef.current = true
          setIsDragging(true)
          onDragStart?.(event, info)
        }}
        onDragEnd={(event, info) => {
          setIsDragging(false)
          setOrbAnimationPulse(value => value + 1)
          onDragEnd?.(event, info)
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'fixed bottom-[100px] left-1/2 z-100 -ml-6 size-12 touch-none select-none',
          className,
        )}
        {...props}
      >
        {hasOpened && (
          <RadialMenuActions
            id={menuId}
            isOpen={isOpen}
            aim={aim}
            isSkyOpen={isSkyOpen}
            panelRef={panelRef}
            onAimChange={handleAimChange}
            onSkyOpenChange={setIsSkyOpen}
            onSelect={handleSelect}
          />
        )}
        <FloatingMenuActionButton
          ref={triggerRef}
          data-click-sound="manual"
          aria-expanded={isOpen}
          aria-controls={hasOpened ? menuId : undefined}
          aria-label={
            isOpen ? translations.common.closeQuickMenu : translations.common.openQuickMenu
          }
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={cancelGesture}
          onLostPointerCapture={cancelGesture}
          onClick={event => {
            if (ignoreClickRef.current || (draggedRef.current && event.detail !== 0)) {
              ignoreClickRef.current = false
              return
            }
            focusOnOpenRef.current = event.detail === 0 && !isOpen
            playTap()
            handleOpenChange(!isOpen)
          }}
          className={cn(
            'motion-safe:animate-entry-icon relative z-10 size-12 overflow-hidden border-white/70 p-0 shadow-[0_8px_20px_color-mix(in_srgb,var(--theme-accent)_25%,transparent)] dark:border-white/30',
            isOpen ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing',
          )}
        >
          <FluidOrb
            size={48}
            color="var(--theme-accent)"
            maxDpr={1.5}
            animationDuration={800}
            animationPulse={orbAnimationPulse}
            isAnimating={isDragging}
            aria-hidden
          />
          <span
            aria-hidden
            className={cn(
              'bg-theme-accent pointer-events-none absolute inset-0 grid place-items-center rounded-full text-white transition-opacity duration-200 motion-reduce:transition-none',
              isOpen ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Plus
              className={cn(
                'size-6 transition-transform duration-420 ease-[cubic-bezier(0.24,1.34,0.38,1)] motion-reduce:transition-none',
                isOpen && 'rotate-135',
              )}
            />
          </span>
        </FloatingMenuActionButton>
      </motion.div>
    </>,
    portal,
  )
}
