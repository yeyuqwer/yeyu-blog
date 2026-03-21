'use client'

import type { HTMLMotionProps } from 'motion/react'
import { AnimatePresence, motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { type FC, useEffect, useRef, useState } from 'react'
import { useTransitionTheme } from '@/hooks/animation'
import { useSound } from '@/hooks/common/use-sound'
import { cn } from '@/lib/utils/common/shadcn'
import { uChatScrollButtonSound } from '@/lib/utils/sound/u-chat-scroll-button'
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
const goldenRatio = 1.61803398875
const goldenRatioInv = 1 / goldenRatio
const goldenRatioInvSquare = goldenRatioInv * goldenRatioInv
const flowTimesPrimary = [
  0,
  goldenRatioInvSquare,
  goldenRatioInv,
  goldenRatioInv + goldenRatioInvSquare / 2,
  1,
]
const flowTimesSecondary = [
  0,
  goldenRatioInvSquare * goldenRatioInv,
  goldenRatioInvSquare,
  goldenRatioInv,
  1,
]

// TODO: 固定底部时吸附效果
// TODO: 类似 ipad cursor ?
export const DraggableFloatingMenu: FC<HTMLMotionProps<'div'>> = ({ className, ...props }) => {
  const pathname = usePathname()
  const { isAnimationComplete } = useStartupStore()
  const { setTransitionTheme, resolvedTheme } = useTransitionTheme()
  const { isPlaying, play, pause } = useBackgroundMusicStore()
  const setModalOpen = useModalStore(s => s.setModalOpen)
  const [playClickSoft] = useSound(uChatScrollButtonSound)
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
      <div
        ref={constraintsRef}
        className="pointer-events-none fixed top-24 right-20 bottom-4 left-20"
      />
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
          'fixed bottom-20 left-1/2 z-100 -ml-6 cursor-grab active:cursor-grabbing',
          className,
        )}
        {...props}
      >
        <div
          className="relative flex size-12 items-center justify-center overflow-hidden rounded-full border border-white/70 shadow-[0_8px_20px_color-mix(in_srgb,var(--theme-indicator)_35%,transparent)] dark:border-white/10 dark:shadow-[0_0_18px_rgba(255,255,255,0.3),0_10px_24px_rgba(0,0,0,0.56)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-[linear-gradient(145deg,color-mix(in_srgb,var(--theme-indicator)_48%,white)_0%,color-mix(in_srgb,var(--theme-300)_62%,white)_38%,color-mix(in_srgb,var(--theme-200)_82%,white)_72%,color-mix(in_srgb,var(--theme-400)_56%,white)_100%)] dark:bg-[linear-gradient(145deg,color-mix(in_srgb,var(--theme-500)_34%,rgb(63_63_70))_0%,color-mix(in_srgb,var(--theme-400)_30%,rgb(82_82_91))_42%,color-mix(in_srgb,var(--theme-300)_24%,rgb(63_63_70))_74%,color-mix(in_srgb,var(--theme-600)_38%,rgb(39_39_42))_100%)]"
            animate={{
              backgroundPosition: ['16% 24%', '80% 36%', '28% 78%', '72% 64%', '16% 24%'],
            }}
            transition={{
              duration: 8.8,
              repeat: Infinity,
              ease: 'easeInOut',
              times: flowTimesPrimary,
            }}
            style={{ backgroundSize: '230% 230%' }}
          />
          <motion.span
            className="absolute -top-2 -left-1 size-7 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.58)_0%,rgba(255,255,255,0.12)_52%,transparent_74%)] mix-blend-screen blur-[0.5px] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.025)_56%,transparent_78%)]"
            animate={{
              x: [0, 10 * goldenRatioInv, -14 * goldenRatioInvSquare, 8, 0],
              y: [0, -12 * goldenRatioInvSquare, 9 * goldenRatioInv, -6, 0],
              scale: [1, 1.08, 0.94, 1.12, 1],
              opacity: [0.42, 0.64, 0.5, 0.68, 0.42],
            }}
            transition={{
              duration: 7.9,
              repeat: Infinity,
              ease: 'easeInOut',
              times: flowTimesPrimary,
            }}
          />
          <motion.span
            className="absolute -right-3 bottom-0 size-8 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--theme-indicator)_34%,white)_0%,color-mix(in_srgb,var(--theme-300)_26%,white)_44%,transparent_72%)] mix-blend-screen blur-[0.5px] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_42%,transparent_70%)]"
            animate={{
              x: [0, -9 * goldenRatioInv, 7, -11 * goldenRatioInvSquare, 0],
              y: [0, 7 * goldenRatioInvSquare, -8 * goldenRatioInv, 9, 0],
              scale: [1.04, 0.96, 1.1, 0.98, 1.04],
              opacity: [0.32, 0.52, 0.4, 0.58, 0.32],
            }}
            transition={{
              duration: 11.3,
              repeat: Infinity,
              ease: 'easeInOut',
              times: flowTimesSecondary,
            }}
          />
          <span className="absolute inset-[2px] rounded-full bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.16)_38%,transparent_70%)] dark:bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.03)_36%,transparent_68%)]" />
          <span className="absolute top-0 left-0 size-full animate-ye-ping-one-dot-one rounded-full ring-2 ring-theme-400 ring-offset-1 ring-offset-background dark:ring-theme-600 dark:ring-offset-black" />
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
                      'absolute top-1 left-1 flex size-10 cursor-pointer items-center justify-center rounded-full shadow-md shadow-theme-indicator/15 backdrop-blur-md transition-[color,background-color,border-color,box-shadow] duration-300 dark:shadow-black/35',
                      'border border-border/90 bg-background/95 dark:border-neutral-800 dark:bg-black dark:shadow-sm',
                      isFunctionActive
                        ? 'text-theme-indicator dark:text-white'
                        : 'text-zinc-500 dark:text-neutral-500',
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
