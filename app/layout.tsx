import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { headers } from 'next/headers'
import { metadata } from '@/config/seo'
import '@/lib/styles/index.css'
import {
  brandThemeRequestHeader,
  defaultBrandTheme,
  isBrandThemeId,
} from '@/lib/styles/themes/constant'
import GlobalProvider from '@/ui/components/provider/global'

export { metadata }

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const brandTheme = requestHeaders.get(brandThemeRequestHeader)
  const initialBrandTheme = isBrandThemeId(brandTheme) ? brandTheme : defaultBrandTheme

  return (
    <html lang="zh-CN" suppressHydrationWarning data-brand-theme={initialBrandTheme}>
      <body className="font-ye-font">
        <GlobalProvider>{children}</GlobalProvider>
        <Analytics mode="production" />
        <SpeedInsights />
      </body>
    </html>
  )
}
