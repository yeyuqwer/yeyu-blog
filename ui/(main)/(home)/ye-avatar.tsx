'use client'

import type { Point } from '../layout/draggable-floating-menu/constant'
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import avatar from '@/config/img/avatar.webp'
import { useTransitionTheme } from '@/hooks/animation'
import { cn } from '@/lib/utils/common/shadcn'
import { typedEntries } from '@/lib/utils/typed'
import { useBackgroundMusicStore } from '@/store/use-background-music-store'
import { type IconsId, icons } from '../layout/draggable-floating-menu/constant'

export default function YeAvatar() {
  const { setTransitionTheme, resolvedTheme } = useTransitionTheme()
  const { isPlaying, play, pause } = useBackgroundMusicStore()
  const [isDragging, setIsDragging] = useState(false)
  const [activeIcon, setActiveIcon] = useState<IconsId | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const soundEffectRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    soundEffectRef.current = new Audio('/sound/ui-select.wav')

    return () => {
      soundEffectRef.current = null
    }
  }, [])

  const checkProximity = (currX: number, currY: number) => {
    const threshold = 100

    const points = icons.reduce<Record<(typeof icons)[number]['id'], Point>>(
      (acc, { id, initial }) => {
        acc[id] = {
          x: -initial.x * (100 / 30),
          y: -initial.y * (30 / 10),
        }
        return acc
      },
      {} as Record<(typeof icons)[number]['id'], Point>,
    )

    let closest: IconsId | null = null
    let minDist = Infinity

    for (const [key, pos] of typedEntries(points)) {
      const dist = Math.hypot(currX - pos.x, currY - pos.y)

      if (dist < minDist) {
        minDist = dist
        closest = key
      }
    }

    if (minDist < threshold && closest !== null) {
      setActiveIcon(closest)
    } else {
      setActiveIcon(null)
    }
  }

  useMotionValueEvent(x, 'change', latest => checkProximity(latest, y.get()))
  useMotionValueEvent(y, 'change', latest => checkProximity(x.get(), latest))

  return (
    <div className="relative">
      <AnimatePresence>
        {isDragging && (
          <>
            {icons.map(({ id, Icon, className, initial }) => {
              const isFunctionActive =
                (id === 'tl' && !isPlaying) ||
                (id === 'tr' && isPlaying) ||
                (id === 'bl' && resolvedTheme === 'light') ||
                (id === 'br' && resolvedTheme === 'dark')

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0, ...initial }}
                  animate={{
                    opacity: 1,
                    scale: activeIcon === id ? 1.2 : 1,
                    x: 0,
                    y: 0,
                  }}
                  exit={{ opacity: 0, scale: 0, ...initial }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={cn(
                    'absolute z-50 flex size-10 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-colors duration-300',
                    className,
                    'border border-zinc-200 bg-white dark:border-neutral-800 dark:bg-black',
                    activeIcon === id || isFunctionActive
                      ? 'text-mint-indicator dark:text-white'
                      : 'text-zinc-500 dark:text-neutral-500',
                  )}
                >
                  {activeIcon === id && (
                    <span className="absolute inset-0 animate-ye-ping-one-dot-one rounded-full ring-2 ring-mint-indicator ring-offset-2 ring-offset-mint-400 dark:ring-white dark:ring-offset-black" />
                  )}
                  <Icon className="relative z-10 size-5" />
                </motion.div>
              )
            })}
          </>
        )}
      </AnimatePresence>

      {/* 摸摸头~ */}
      <motion.figure
        // TODO: config color
        className="relative cursor-grab drop-shadow-2xl active:drop-shadow-[#7AB2B2] dark:active:drop-shadow-[#c0c0c0]"
        whileTap={{ scale: 0.99, rotate: 1 }}
        drag
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onDragEnd={() => {
          setIsDragging(false)

          const playSoundEffect = () => {
            if (soundEffectRef.current !== null) {
              soundEffectRef.current.currentTime = 0
              soundEffectRef.current.play().catch(e => console.error('Sound effect play failed', e))
            }
          }

          if (activeIcon === 'bl') {
            setTransitionTheme('light', { direction: 'left', duration: 300 })
            playSoundEffect()
          } else if (activeIcon === 'br') {
            setTransitionTheme('dark', { direction: 'right', duration: 300 })
            playSoundEffect()
          } else if (activeIcon === 'tl') {
            pause()
          } else if (activeIcon === 'tr') {
            play()
            playSoundEffect()
          }
        }}
        style={{ x, y }}
      >
        <Image
          src={avatar}
          alt="avatar"
          className="w-44 rounded-full md:w-52"
          placeholder="blur"
          priority
        />
        <span className="absolute top-0 left-0 size-full animate-ye-ping-one-dot-one rounded-full ring-4 ring-mint-400 ring-offset-1 dark:ring-white dark:ring-offset-black" />
      </motion.figure>
    </div>
  )
}
