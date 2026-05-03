'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sileo'
import { BrandThemeInitializer } from './brand-theme-initializer'
import ReactQueryProvider from './react-query-provider'

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BrandThemeInitializer />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <ReactQueryProvider>
          {children}
          <Toaster position="top-center" />
        </ReactQueryProvider>
      </ThemeProvider>
    </>
  )
}
