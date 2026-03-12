'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sileo'
import ReactQueryProvider from './react-query-provider'
import WalletProvider from './wallet-provider'

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ReactQueryProvider>
        <WalletProvider>
          {children}
          <Toaster position="top-left" />
        </WalletProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  )
}
