import type React from 'react'
import { LanguageProvider } from './language-provider'
import { MainClickFeedback } from './main-click-feedback'
import { MainModalProvider } from './main-modal-provider'

export default function MainProvider({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <MainClickFeedback>
        <MainModalProvider>{children}</MainModalProvider>
      </MainClickFeedback>
    </LanguageProvider>
  )
}
