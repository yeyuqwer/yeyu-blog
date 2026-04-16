'use client'

import { ThemeProvider } from 'next-themes'
import {
  brandThemeAttribute,
  brandThemeOptions,
  brandThemeStorageKey,
  defaultBrandTheme,
} from '@/lib/styles/themes/constant'

const brandThemeIds = brandThemeOptions.map(option => option.id)

export default function BrandThemeProvider() {
  return (
    <ThemeProvider
      attribute={brandThemeAttribute}
      defaultTheme={defaultBrandTheme}
      enableColorScheme={false}
      enableSystem={false}
      storageKey={brandThemeStorageKey}
      themes={brandThemeIds}
    >
      {null}
    </ThemeProvider>
  )
}
