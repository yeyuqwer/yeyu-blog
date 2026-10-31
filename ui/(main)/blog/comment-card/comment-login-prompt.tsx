import { LogIn } from 'lucide-react'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
import { Button } from '@/ui/shadcn/button'

export function CommentLoginPrompt({ onLoginClick }: { onLoginClick: () => void }) {
  const translations = useTranslations()

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-black/65 dark:text-white/65">
        <LanguageText>{translations.comments.loginPrompt}</LanguageText>
      </p>
      <Button
        type="button"
        className="h-8 rounded-lg bg-black px-4 text-white shadow-[0_6px_16px_rgba(0,0,0,0.16)] hover:bg-zinc-800 hover:text-white focus-visible:ring-black/25 dark:bg-white dark:text-black dark:shadow-[0_6px_16px_rgba(0,0,0,0.28)] dark:hover:bg-zinc-200 dark:hover:text-black dark:focus-visible:ring-white/30"
        onClick={onLoginClick}
      >
        <LogIn className="size-4" />
        <LanguageText>{translations.comments.loginToComment}</LanguageText>
      </Button>
    </div>
  )
}
