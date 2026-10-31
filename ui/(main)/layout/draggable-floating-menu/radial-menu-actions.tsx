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
                'bg-background/90 text-foreground border-border/60 focus-visible:outline-theme-ring hover:bg-background data-aim:ring-theme-accent absolute top-0 left-0 grid size-12 cursor-pointer place-items-center rounded-full border opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-[transform,opacity,background-color,box-shadow] duration-[420ms,220ms,160ms,160ms] ease-[cubic-bezier(0.24,1.34,0.38,1)] focus-visible:outline-2 data-aim:ring-2 data-open:pointer-events-auto data-open:opacity-100 motion-reduce:transition-none dark:border-white/15 dark:shadow-[0_6px_20px_rgba(0,0,0,0.25)]',
                action.isActive && 'text-theme-primary bg-theme-surface/95',
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
              <action.Icon aria-hidden className="size-5" strokeWidth={1.8} />
              {action.isActive && (
                <span
                  aria-hidden
                  className="bg-theme-accent absolute right-2 bottom-2 size-1 rounded-full"
                />
              )}
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
            'bg-background/95 text-foreground/75 absolute top-16 left-1/2 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg px-2.5 py-1.5 text-center text-[11px] shadow-sm transition-opacity duration-160 motion-reduce:transition-none',
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
            className="border-border/60 bg-background text-foreground max-h-[min(24rem,var(--available-height))] w-[min(17rem,calc(100vw-2rem))] origin-(--transform-origin) overflow-y-auto overscroll-contain rounded-2xl border p-4 shadow-xl transition-[opacity,scale] duration-180 outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-[0.98] motion-safe:data-starting-style:scale-[0.98] motion-reduce:transition-none dark:border-white/12 dark:bg-zinc-950"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 id={titleId} className="text-sm font-medium">
                <LanguageText>{translations.common.skySettings}</LanguageText>
              </h2>
              <button
                type="button"
                aria-label={translations.common.closeSkySettings}
                className="text-foreground/45 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-theme-ring grid size-7 cursor-pointer place-items-center rounded-lg transition-colors focus-visible:outline-2 motion-reduce:transition-none"
                onClick={() => onSkyOpenChange(false)}
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>
            <SkyBackgroundControls />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
