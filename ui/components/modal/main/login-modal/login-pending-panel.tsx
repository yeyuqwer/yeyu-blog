import { LoaderCircle } from 'lucide-react'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'

export const LoginPendingPanel = () => {
  const translations = useTranslations()

  return (
    <div
      role="status"
      className="motion-safe:animate-entry-text flex min-h-24 flex-col items-center justify-center gap-3 py-4 [animation-duration:200ms]"
    >
      <LoaderCircle
        aria-hidden
        className="size-6 text-zinc-500 motion-safe:animate-spin dark:text-zinc-400"
      />
      <p className="text-muted-foreground text-sm">
        <LanguageText>{translations.loginModal.signingIn}</LanguageText>
      </p>
    </div>
  )
}
