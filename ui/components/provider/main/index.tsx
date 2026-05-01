import type React from 'react'
import { MainModalProvider } from './main-modal-provider'

export default function MainProvider({ children }: { children: React.ReactNode }) {
  return <MainModalProvider>{children}</MainModalProvider>
}
