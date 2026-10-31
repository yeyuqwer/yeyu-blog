'use client'

import type { ReactNode } from 'react'
import { playTick } from '@/lib/core/sound/bencho-sounds'

const clickFeedbackSelector = [
  'button',
  'a[href]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  '[role="button"]',
  '[role="link"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="menuitem"]',
].join(',')

export function MainClickFeedback({ children }: { children: ReactNode }) {
  return (
    <div
      className="contents"
      onClickCapture={event => {
        if (!(event.target instanceof Element)) return

        const control = event.target.closest(clickFeedbackSelector)
        if (
          control == null ||
          control.matches(':disabled, [disabled], [data-disabled]') ||
          control.closest('[inert], [aria-disabled="true"]') != null ||
          control.getAttribute('data-click-sound') === 'manual'
        ) {
          return
        }

        playTick()
      }}
    >
      {children}
    </div>
  )
}
