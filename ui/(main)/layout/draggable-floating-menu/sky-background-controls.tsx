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
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="text-foreground/55 flex items-center justify-between gap-3 text-xs">
          <LanguageText>{translations.common.skyTime}</LanguageText>
          <output htmlFor={timeInputId} className="text-foreground/80 tabular-nums">
            {timeState.label}
          </output>
        </div>
        <div className="flex min-h-7 items-center justify-between gap-3">
          <label className="cursor-pointer text-xs" htmlFor={realTimeInputId}>
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
          <div className="motion-safe:animate-entry-icon space-y-2 pb-1">
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
          </div>
        )}
      </div>

      <div className="border-border/60 space-y-3 border-t pt-3">
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
            <div className="text-foreground/55 flex items-center justify-between gap-3 text-xs">
              <label htmlFor={cloudSpeedInputId}>
                <LanguageText>{translations.common.cloudSpeed}</LanguageText>
              </label>
              <output htmlFor={cloudSpeedInputId} className="text-foreground/80 tabular-nums">
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
        className="text-foreground/45 hover:text-foreground focus-visible:outline-theme-ring flex min-h-8 cursor-pointer items-center gap-1.5 rounded-md text-[11px] transition-colors focus-visible:outline-2 motion-reduce:transition-none"
        onClick={resetSkyBackground}
      >
        <RotateCcw aria-hidden className="size-3" />
        <LanguageText>{translations.common.resetSkyBackground}</LanguageText>
      </button>
    </div>
  )
}
