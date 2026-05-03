import type React from 'react'
import { MainModalProvider } from './main-modal-provider'

export default function MainProvider({
  children,
  friendLinkEmailPlaceholder,
}: {
  children: React.ReactNode
  friendLinkEmailPlaceholder?: string
}) {
  return (
    <MainModalProvider friendLinkEmailPlaceholder={friendLinkEmailPlaceholder}>
      {children}
    </MainModalProvider>
  )
}
