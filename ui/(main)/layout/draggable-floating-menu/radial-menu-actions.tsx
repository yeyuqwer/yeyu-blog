'use client'

import { Popover } from '@base-ui/react/popover'
import { Eye, EyeOff, Moon, SlidersHorizontal, Sun, Volume2, VolumeX, Wind, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { type RefObject, useId } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { useBackgroundMusicActions, useIsPlaying } from '@/store/use-background-music-store'
import {
  useIsBackgroundOnly,
  useIsCloudAnimationRunning,
  useSkyBackgroundActions,
} from '@/store/use-sky-background-store'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
import { SkyBackgroundControls } from './sky-background-controls'

// Bencho's half-circle fan: 48px options, 28ms stagger, and a spring-shaped CSS easing.
export const radialOffsets = [-180, -135, -90, -45, 0].map(angle => ({
  x: Math.round(Math.cos((angle * Math.PI) / 180) * 84),
  y: Math.round(Math.sin((angle * Math.PI) / 180) * 84),
}))

export default function RadialMenuActions({
  id,
  isOpen,
  aim,
  isSkyOpen,
  panelRef,
  onAimChange,
  onSkyOpenChange,
  onSelect,
}: {
  id: string
  isOpen: boolean
  aim: number | null
  isSkyOpen: boolean
  panelRef: RefObject<HTMLDivElement | null>
  onAimChange: (aim: number | null) => void
  onSkyOpenChange: (isOpen: boolean) => void
  onSelect: () => void
}) {
  const translations = useTranslations()
  const { setTheme, resolvedTheme } = useTheme()
  const isPlaying = useIsPlaying()
  const isBackgroundOnly = useIsBackgroundOnly()
  const isCloudAnimationRunning = useIsCloudAnimationRunning()
  const { play, pause } = useBackgroundMusicActions()
  const { setBackgroundOnly, setCloudAnimationRunning } = useSkyBackgroundActions()
  const titleId = useId()

  const actions = [
    {
      id: 'theme',
      label:
        resolvedTheme === 'dark'
          ? translations.common.switchToLightTheme
          : translations.common.switchToDarkTheme,
      Icon: resolvedTheme === 'dark' ? Sun : Moon,
      isActive: false,
      onSelect: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    },
    {
      id: 'music',
      label: isPlaying ? translations.common.pauseMusic : translations.common.playMusic,
      Icon: isPlaying ? Volume2 : VolumeX,
      isActive: isPlaying,
      onSelect: () => (isPlaying ? pause() : play()),
    },
    {
      id: 'background',
      label: isBackgroundOnly
        ? translations.common.showFullInterface
        : translations.common.showBackgroundOnly,
      Icon: isBackgroundOnly ? EyeOff : Eye,
      isActive: isBackgroundOnly,
      onSelect: () => setBackgroundOnly(!isBackgroundOnly),
    },
    {
      id: 'clouds',
      label: isCloudAnimationRunning
        ? translations.common.pauseCloudMotion
        : translations.common.playCloudMotion,
      Icon: Wind,
      isActive: isCloudAnimationRunning,
      onSelect: () => setCloudAnimationRunning(!isCloudAnimationRunning),
    },
    {
      id: 'sky',
      label: translations.common.skySettings,
      Icon: SlidersHorizontal,
      isActive: isSkyOpen,
      onSelect: undefined,
    },
  ]

  return (
    <Popover.Root open={isOpen && isSkyOpen} onOpenChange={onSkyOpenChange}>
      <div
        id={id}
        role="group"
        aria-label={translations.common.quickSettings}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className="pointer-events-none absolute inset-0"
      >
        {actions.map((action, index) => {
          const offset = radialOffsets[index]
          const button = (
            <button
              key={action.id}
              type="button"
              data-radial-option=""
              data-open={isOpen ? '' : undefined}
              data-aim={aim === index ? '' : undefined}
              aria-label={action.label}
              aria-pressed={
                action.id === 'sky' || action.id === 'theme' ? undefined : action.isActive
              }
              tabIndex={isOpen ? 0 : -1}
              className={cn(
                'focus-visible:outline-theme-ring absolute top-0.5 left-0.5 grid size-11 cursor-pointer place-items-center rounded-full border border-white/55 bg-white/25 text-zinc-800/80 opacity-0 shadow-[0_4px_16px_-6px_rgba(24,24,27,0.18),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-lg backdrop-saturate-150 transition-[transform,opacity,background-color,box-shadow] duration-[420ms,220ms,160ms,160ms] ease-[cubic-bezier(0.24,1.34,0.38,1)] hover:bg-white/50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 data-aim:bg-white/50 data-aim:text-zinc-900 data-open:pointer-events-auto data-open:opacity-100 motion-reduce:transition-none dark:border-white/20 dark:bg-zinc-900/25 dark:text-white/80 dark:shadow-[0_4px_16px_-6px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] dark:hover:bg-white/15 dark:hover:text-white dark:data-aim:bg-white/15 dark:data-aim:text-white',
                action.isActive &&
                  'text-theme-primary hover:text-theme-primary data-aim:text-theme-primary dark:text-theme-primary dark:hover:text-theme-primary dark:data-aim:text-theme-primary border-white/80 bg-white/55 dark:border-white/40 dark:bg-white/20',
              )}
              style={{
                transform: isOpen
                  ? `translate(${offset.x}px, ${offset.y}px) scale(1)`
                  : 'translate(0, 0) scale(0.4)',
                transitionDelay: isOpen ? `${index * 28}ms` : '0ms',
              }}
              onPointerDown={event => event.stopPropagation()}
              onPointerEnter={() => onAimChange(index)}
              onPointerLeave={() => onAimChange(null)}
              onFocus={() => onAimChange(index)}
              onBlur={() => onAimChange(null)}
              onClick={() => {
                if (action.id === 'sky') return
                action.onSelect?.()
                onSelect()
              }}
            >
              <action.Icon aria-hidden className="size-[18px]" strokeWidth={1.7} />
            </button>
          )

          return action.id === 'sky' ? (
            <Popover.Trigger key={action.id} render={button} />
          ) : (
            <span key={action.id}>{button}</span>
          )
        })}
        <span
          aria-hidden
          className={cn(
            'absolute top-16 left-1/2 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full border border-white/45 bg-white/40 px-3 py-1.5 text-center text-[11px] leading-4 text-zinc-800 backdrop-blur-lg backdrop-saturate-150 transition-opacity duration-160 motion-reduce:transition-none dark:border-white/15 dark:bg-zinc-900/35 dark:text-white/85',
            isOpen && aim !== null && !isSkyOpen ? 'opacity-100' : 'opacity-0',
          )}
        >
          {aim !== null && <LanguageText>{actions[aim].label}</LanguageText>}
        </span>
      </div>

      <Popover.Portal>
        <Popover.Positioner side="top" sideOffset={12} className="z-[110] outline-none">
          <Popover.Popup
            ref={panelRef}
            aria-labelledby={titleId}
            className="max-h-[min(24rem,var(--available-height))] w-[min(17rem,calc(100vw-2rem))] origin-(--transform-origin) overflow-y-auto overscroll-contain rounded-[14px] border border-white/60 bg-white/55 p-4 text-zinc-800 shadow-[0_16px_40px_-16px_rgba(24,24,27,0.2),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-2xl backdrop-saturate-150 transition-[opacity,scale] duration-180 outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-[0.98] motion-safe:data-starting-style:scale-[0.98] motion-reduce:transition-none dark:border-white/20 dark:bg-zinc-900/50 dark:text-white/90 dark:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id={titleId} className="text-[13px] font-medium">
                <LanguageText>{translations.common.skySettings}</LanguageText>
              </h2>
              <button
                type="button"
                aria-label={translations.common.closeSkySettings}
                className="focus-visible:outline-theme-ring -mr-1 grid size-6 cursor-pointer place-items-center rounded-full text-zinc-600 transition-colors hover:bg-white/40 hover:text-zinc-900 focus-visible:outline-2 motion-reduce:transition-none dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                onClick={() => onSkyOpenChange(false)}
              >
                <X aria-hidden className="size-3.5" />
              </button>
            </div>
            <SkyBackgroundControls />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
