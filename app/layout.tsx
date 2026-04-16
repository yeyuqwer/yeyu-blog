import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { metadata } from '@/config/seo'
import '@/lib/styles/index.css'
import { defaultBrandTheme } from '@/lib/styles/themes/constant'
import GlobalProvider from '@/ui/components/provider/global'

export { metadata }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning data-brand-theme={defaultBrandTheme}>
      <body className="font-ye-font">
        <GlobalProvider>{children}</GlobalProvider>
        <Analytics mode="production" />
        <SpeedInsights />
      </body>
    </html>
  )
}
