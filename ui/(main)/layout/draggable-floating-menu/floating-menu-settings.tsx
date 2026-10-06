'use client'

import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { useSound } from '@/hooks/common/use-sound'
import { uChatScrollButtonSound } from '@/lib/core/sound/u-chat-scroll-button'
import { cn } from '@/lib/utils/common/shadcn'
import { useBackgroundMusicActions, useIsPlaying } from '@/store/use-background-music-store'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { MoonIcon } from '@/ui/shadcn/moon'
import { SunIcon } from '@/ui/shadcn/sun'
import { Switch } from '@/ui/shadcn/switch'
import { VolumeIcon } from '@/ui/shadcn/volume'
import { VolumeOffIcon } from '@/ui/shadcn/volume-off'
import { SkyBackgroundControls } from './sky-background-controls'

export default function FloatingMenuSettings() {
  const translations = useTranslations()
  const { setTheme, resolvedTheme } = useTheme()
  const isPlaying = useIsPlaying()
  const { play, pause } = useBackgroundMusicActions()
  const [playClickSoft] = useSound(uChatScrollButtonSound)

  const handleMusicChange = (shouldPlay: boolean) => {
    if (shouldPlay) {
      play()
      playClickSoft()
      return
    }

    pause()
  }

  const handleThemeChange = (nextTheme: 'light' | 'dark') => {
    if (resolvedTheme === nextTheme) return

    setTheme(nextTheme)
    playClickSoft()
  }

  return (
    <div className="divide-y divide-border/60">
      <div className="flex min-h-12 items-center justify-between gap-4 px-2 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {isPlaying ? (
            <VolumeIcon aria-hidden className="size-4.5 shrink-0" size={18} />
          ) : (
            <VolumeOffIcon aria-hidden className="size-4.5 shrink-0" size={18} />
          )}
          <span className="truncate text-sm">{translations.common.backgroundMusic}</span>
        </div>
        <Switch
          checked={isPlaying}
          onCheckedChange={handleMusicChange}
          aria-label={isPlaying ? translations.common.pauseMusic : translations.common.playMusic}
          className="cursor-pointer"
        />
      </div>

      <SkyBackgroundControls />

      <div className="flex min-h-12 items-center justify-between gap-4 px-2 py-2">
        <span className="shrink-0 text-sm">{translations.common.appearance}</span>
        <div
          role="group"
          aria-label={translations.common.appearance}
          className="relative grid grid-cols-2 rounded-full bg-foreground/6 p-0.5 dark:bg-white/10"
        >
          <motion.span
            aria-hidden
            className="absolute top-0.5 right-1/2 bottom-0.5 left-0.5 rounded-full bg-background shadow-sm dark:bg-white/18 dark:shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
            initial={false}
            animate={{ x: resolvedTheme === 'dark' ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }}
          />
          <button
            type="button"
            aria-pressed={resolvedTheme === 'light'}
            aria-label={translations.common.switchToLightTheme}
            className={cn(
              'relative z-10 flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-theme-ring',
              resolvedTheme === 'light'
                ? 'text-foreground dark:text-white'
                : 'text-foreground/50 hover:text-foreground/80 dark:text-zinc-400 dark:hover:text-white',
            )}
            onClick={() => handleThemeChange('light')}
          >
            <SunIcon aria-hidden className="size-3.5" size={14} />
            {translations.common.lightTheme}
          </button>
          <button
            type="button"
            aria-pressed={resolvedTheme === 'dark'}
            aria-label={translations.common.switchToDarkTheme}
            className={cn(
              'relative z-10 flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-theme-ring',
              resolvedTheme === 'dark'
                ? 'text-foreground dark:text-white'
                : 'text-foreground/50 hover:text-foreground/80 dark:text-zinc-400 dark:hover:text-white',
            )}
            onClick={() => handleThemeChange('dark')}
          >
            <MoonIcon aria-hidden className="size-3.5" size={14} />
            {translations.common.darkTheme}
          </button>
        </div>
      </div>
    </div>
  )
}
