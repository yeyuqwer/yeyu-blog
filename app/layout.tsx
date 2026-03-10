import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { metadata } from '@/config/seo'
import '@/lib/styles/index.css'
import {
  BRAND_THEME_ATTRIBUTE,
  BRAND_THEME_STORAGE_KEY,
  brandThemeOptions,
  DEFAULT_BRAND_THEME,
} from '@/lib/styles/themes/constant'
import GlobalProvider from '@/ui/components/provider/global'

export { metadata }

const brandThemeIds = brandThemeOptions.map(option => option.id)

const initialBrandThemeScript = `
(() => {
  const storageKey = ${JSON.stringify(BRAND_THEME_STORAGE_KEY)};
  const attribute = ${JSON.stringify(BRAND_THEME_ATTRIBUTE)};
  const fallback = ${JSON.stringify(DEFAULT_BRAND_THEME)};
  const brandThemes = ${JSON.stringify(brandThemeIds)};

  try {
    const stored = window.localStorage.getItem(storageKey);
    const nextTheme = stored !== null && brandThemes.includes(stored) ? stored : fallback;
    document.documentElement.setAttribute(attribute, nextTheme);
  } catch {
    document.documentElement.setAttribute(attribute, fallback);
  }
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning data-brand-theme={DEFAULT_BRAND_THEME}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initialBrandThemeScript }} />
      </head>
      <body className="font-ye-font">
        <GlobalProvider>{children}</GlobalProvider>
        <Analytics mode="production" />
        <SpeedInsights />
      </body>
    </html>
  )
}
