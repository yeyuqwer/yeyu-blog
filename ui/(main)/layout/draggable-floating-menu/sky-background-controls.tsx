'use client'

import { Clock3, Cloud, Eye, RotateCcw } from 'lucide-react'
import { useId } from 'react'
import {
  useCloudSpeed,
  useIsBackgroundOnly,
  useIsCloudAnimationRunning,
  useIsUsingRealTime,
  useSkyBackgroundActions,
  useSkyBackgroundTimeState,
} from '@/store/use-sky-background-store'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
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
  const isBackgroundOnly = useIsBackgroundOnly()
  const isCloudAnimationRunning = useIsCloudAnimationRunning()
  const isUsingRealTime = useIsUsingRealTime()
  const { minutesOfDay, timeState } = useSkyBackgroundTimeState()
  const {
    resetSkyBackground,
    setBackgroundOnly,
    setCloudAnimationRunning,
    setCloudSpeed,
    setMinutesOfDay,
    setUsingRealTime,
  } = useSkyBackgroundActions()
  const timeInputId = useId()
  const cloudSpeedInputId = useId()

  return (
    <>
      <div className="flex min-h-12 items-center justify-between gap-4 px-2 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <Eye aria-hidden className="size-4.5 shrink-0" />
          <span className="truncate text-sm">{translations.common.backgroundOnly}</span>
        </div>
        <Switch
          checked={isBackgroundOnly}
          className="cursor-pointer"
          aria-label={
            isBackgroundOnly
              ? translations.common.showFullInterface
              : translations.common.showBackgroundOnly
          }
          onCheckedChange={setBackgroundOnly}
        />
      </div>

      <div className="space-y-3 px-2 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Clock3 aria-hidden className="size-4.5 shrink-0" />
            <label className="truncate text-sm" htmlFor={timeInputId}>
              {translations.common.skyTime}
            </label>
          </div>
          <output className="shrink-0 font-medium text-foreground/70 text-xs tabular-nums">
            {timeState.label}
          </output>
        </div>
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
        <div className="flex items-center justify-between gap-4">
          <span className="text-foreground/65 text-xs">{translations.common.useRealTime}</span>
          <Switch
            checked={isUsingRealTime}
            className="cursor-pointer"
            aria-label={translations.common.useRealTime}
            onCheckedChange={nextIsUsingRealTime =>
              setUsingRealTime(nextIsUsingRealTime, minutesOfDay)
            }
          />
        </div>
      </div>

      <div className="space-y-3 px-2 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Cloud aria-hidden className="size-4.5 shrink-0" />
            <label className="truncate text-sm" htmlFor={cloudSpeedInputId}>
              {translations.common.cloudSpeed}
            </label>
          </div>
          <output className="shrink-0 font-medium text-foreground/70 text-xs tabular-nums">
            {cloudSpeed.toFixed(2)}x
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
        <div className="flex items-center justify-between gap-4">
          <span className="text-foreground/65 text-xs">{translations.common.cloudMotion}</span>
          <Switch
            checked={isCloudAnimationRunning}
            className="cursor-pointer"
            aria-label={
              isCloudAnimationRunning
                ? translations.common.pauseCloudMotion
                : translations.common.playCloudMotion
            }
            onCheckedChange={setCloudAnimationRunning}
          />
        </div>
        <div className="flex min-h-7 items-center gap-3 border-border/60 border-t pt-2 text-[11px] text-foreground/55">
          <span>
            {translations.common.phase}: {translations.common.skyPhases[timeState.phase]}
          </span>
          <button
            type="button"
            aria-label={translations.common.resetSkyBackground}
            className="ml-auto flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-theme-ring"
            title={translations.common.resetSkyBackground}
            onClick={resetSkyBackground}
          >
            <RotateCcw aria-hidden className="size-3.5" />
          </button>
        </div>
      </div>
    </>
  )
}
