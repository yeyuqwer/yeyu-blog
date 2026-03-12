'use client'

import type { HTMLMotionProps } from 'motion/react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { type FC, useEffect, useRef, useState } from 'react'
import avatar from '@/config/img/avatar.webp'
import { useTransitionTheme } from '@/hooks/animation'
import { useSound } from '@/hooks/common/use-sound'
import { cn } from '@/lib/utils/common/shadcn'
import { clickSoftSound } from '@/lib/utils/sound/click-soft'
import { useBackgroundMusicStore } from '@/store/use-background-music-store'
import { useModalStore } from '@/store/use-modal-store'
import { useStartupStore } from '@/store/use-startup-store'
import { type IconsId, icons } from './constant'

const menuRadius = 82
const menuAngles: Record<IconsId, number> = {
  tl: 160,
  tr: 20,
  lm: 90,
  bl: 125,
  br: 55,
}

// TODO: 固定底部时吸附效果
// TODO: 类似 ipad cursor ?
export const DraggableFloatingMenu: FC<HTMLMotionProps<'div'>> = ({ className, ...props }) => {
  const pathname = usePathname()
  const { isAnimationComplete } = useStartupStore()
  const { setTransitionTheme, resolvedTheme } = useTransitionTheme()
  const { isPlaying, play, pause } = useBackgroundMusicStore()
  const setModalOpen = useModalStore(s => s.setModalOpen)
  const [playClickSoft] = useSound(clickSoftSound)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current !== null && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const playSoundEffect = () => {
    playClickSoft()
  }

  const handleSelect = (id: IconsId) => {
    if (id === 'bl') {
      setTransitionTheme('light', { direction: 'left', duration: 300 })
      playSoundEffect()
    } else if (id === 'br') {
      setTransitionTheme('dark', { direction: 'right', duration: 300 })
      playSoundEffect()
    } else if (id === 'tl') {
      pause()
    } else if (id === 'tr') {
      play()
      playSoundEffect()
    } else if (id === 'lm') {
      setModalOpen('selectThemeModal')
      playSoundEffect()
    }
    setIsOpen(false)
  }

  if (pathname === '/') {
    return null
  }

  return (
    <>
      <div ref={constraintsRef} className="pointer-events-none fixed inset-16 z-50" />
      <motion.div
        ref={containerRef}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0.2, y: 100, opacity: 0 }}
        animate={
          isAnimationComplete
            ? {
                scale: 1,
                y: 0,
                opacity: 1,
                transition: { type: 'spring', stiffness: 260, damping: 20 },
              }
            : { scale: 0.2, y: 100, opacity: 0, transition: { duration: 0 } }
        }
        className={cn(
          'fixed bottom-20 left-1/2 z-50 -ml-6 cursor-grab active:cursor-grabbing',
          className,
        )}
        {...props}
      >
        <div
          className="relative flex size-12 items-center justify-center rounded-full bg-white shadow-lg dark:border dark:border-neutral-800 dark:bg-black dark:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image
            src={avatar}
            alt="menu"
            className="size-full rounded-full object-cover"
            placeholder="blur"
          />
          <span className="absolute top-0 left-0 size-full animate-ye-ping-one-dot-one rounded-full ring-2 ring-theme-indicator ring-offset-1 ring-offset-white dark:ring-neutral-800 dark:ring-offset-black" />
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              {icons.map(({ id, Icon }) => {
                const isFunctionActive =
                  (id === 'tl' && !isPlaying) ||
                  (id === 'tr' && isPlaying) ||
                  (id === 'bl' && resolvedTheme === 'light') ||
                  (id === 'br' && resolvedTheme === 'dark')

                const angle = menuAngles[id]
                const radian = (angle * Math.PI) / 180
                const x = menuRadius * Math.cos(radian)
                const y = -menuRadius * Math.sin(radian)

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x,
                      y,
                    }}
                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={cn(
                      'absolute top-1 left-1 flex size-10 cursor-pointer items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-colors duration-300',
                      'border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black',
                      isFunctionActive
                        ? 'text-black dark:text-white'
                        : 'text-neutral-500 dark:text-neutral-500',
                    )}
                    onClick={e => {
                      e.stopPropagation()
                      handleSelect(id)
                    }}
                  >
                    <Icon className="relative z-10 size-5" />
                  </motion.div>
                )
              })}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
