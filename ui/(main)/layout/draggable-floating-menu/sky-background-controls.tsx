'use client'

import { RotateCcw } from 'lucide-react'
import { useId } from 'react'
import {
  useCloudSpeed,
  useIsCloudAnimationRunning,
  useIsUsingRealTime,
  useSkyBackgroundActions,
  useSkyBackgroundTimeState,
} from '@/store/use-sky-background-store'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
import { Slider } from '@/ui/shadcn/slider'
import { Switch } from '@/ui/shadcn/switch'

const minCloudSpeed = 0.25
const maxCloudSpeed = 3
const cloudSpeedStep = 0.25
const minPreviewMinutesOfDay = 0
const maxPreviewMinutesOfDay = 23 * 60 + 45
const previewMinutesStep = 15

export function SkyBackgroundControls() {
  const translations = useTranslations()
  const cloudSpeed = useCloudSpeed()
  const isCloudAnimationRunning = useIsCloudAnimationRunning()
  const isUsingRealTime = useIsUsingRealTime()
  const { minutesOfDay, timeState } = useSkyBackgroundTimeState()
  const {
    resetSkyBackground,
    setCloudAnimationRunning,
    setCloudSpeed,
    setMinutesOfDay,
    setUsingRealTime,
  } = useSkyBackgroundActions()
  const realTimeInputId = useId()
  const cloudMotionInputId = useId()
  const timeInputId = useId()
  const cloudSpeedInputId = useId()

  return (
    <div className="space-y-4 text-zinc-700 [--input:#71717a30] [--muted:#71717a20] [--primary-foreground:white] [--primary:var(--theme-primary)] [--ring:var(--theme-ring)] dark:text-white/80 dark:[--input:#ffffff25] dark:[--muted:#ffffff18]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs">
          <LanguageText>{translations.common.skyTime}</LanguageText>
          <output
            htmlFor={timeInputId}
            className="rounded-md bg-white/35 px-2 py-1 text-[11px] font-medium text-zinc-800 tabular-nums dark:bg-white/10 dark:text-white/90"
          >
            {timeState.label}
          </output>
        </div>
        <div className="flex min-h-7 items-center justify-between gap-3">
          <label
            className="cursor-pointer text-[11px] text-zinc-600 dark:text-white/65"
            htmlFor={realTimeInputId}
          >
            <LanguageText>{translations.common.useRealTime}</LanguageText>
          </label>
          <Switch
            id={realTimeInputId}
            checked={isUsingRealTime}
            className="cursor-pointer motion-reduce:transition-none [&_[data-slot=switch-thumb]]:motion-reduce:transition-none"
            onCheckedChange={nextIsUsingRealTime =>
              setUsingRealTime(nextIsUsingRealTime, minutesOfDay)
            }
          />
        </div>
        {!isUsingRealTime && (
          <div className="motion-safe:animate-entry-icon space-y-2 pt-1 pb-1">
            <Slider
              aria-label={translations.common.skyTime}
              className="cursor-pointer"
              id={timeInputId}
              max={maxPreviewMinutesOfDay}
              min={minPreviewMinutesOfDay}
              step={previewMinutesStep}
              value={minutesOfDay}
              onValueChange={setMinutesOfDay}
            />
            <div
              aria-hidden
              className="flex justify-between text-[10px] text-zinc-500 tabular-nums dark:text-white/55"
            >
              <span>00:00</span>
              <span>12:00</span>
              <span>23:45</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-white/50 pt-4 dark:border-white/15">
        <div className="flex min-h-7 items-center justify-between gap-3">
          <label className="cursor-pointer text-xs" htmlFor={cloudMotionInputId}>
            <LanguageText>{translations.common.cloudMotion}</LanguageText>
          </label>
          <Switch
            id={cloudMotionInputId}
            checked={isCloudAnimationRunning}
            className="cursor-pointer motion-reduce:transition-none [&_[data-slot=switch-thumb]]:motion-reduce:transition-none"
            onCheckedChange={setCloudAnimationRunning}
          />
        </div>
        {isCloudAnimationRunning && (
          <div className="motion-safe:animate-entry-icon space-y-2 pb-1">
            <div className="flex items-center justify-between gap-3 text-[11px] text-zinc-600 dark:text-white/65">
              <label htmlFor={cloudSpeedInputId}>
                <LanguageText>{translations.common.cloudSpeed}</LanguageText>
              </label>
              <output
                htmlFor={cloudSpeedInputId}
                className="font-medium text-zinc-800 tabular-nums dark:text-white/90"
              >
                {cloudSpeed}×
              </output>
            </div>
            <Slider
              aria-label={translations.common.cloudSpeed}
              className="cursor-pointer"
              id={cloudSpeedInputId}
              max={maxCloudSpeed}
              min={minCloudSpeed}
              step={cloudSpeedStep}
              value={cloudSpeed}
              onValueChange={setCloudSpeed}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        className="focus-visible:outline-theme-ring flex min-h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/35 bg-white/20 text-[11px] text-zinc-600 transition-colors hover:bg-white/40 hover:text-zinc-900 focus-visible:outline-2 motion-reduce:transition-none dark:border-white/10 dark:bg-white/5 dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white"
        onClick={resetSkyBackground}
      >
        <RotateCcw aria-hidden className="size-3" />
        <LanguageText>{translations.common.resetSkyBackground}</LanguageText>
      </button>
    </div>
  )
}
