'use client'

import type { BrandThemeId } from '@/lib/styles/themes/constant'
import { useLayoutEffect } from 'react'
import { applyBrandTheme, getRandomBrandTheme } from '@/lib/styles/themes/constant'

let initializedBrandTheme: BrandThemeId | null = null

export function BrandThemeInitializer() {
  useLayoutEffect(() => {
    if (initializedBrandTheme === null) {
      initializedBrandTheme = getRandomBrandTheme()
    }

    applyBrandTheme(initializedBrandTheme)
  }, [])

  return null
}
