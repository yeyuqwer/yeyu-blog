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
        variant="ghost"
        className="h-8 rounded-xl border border-black/8 bg-black/6 px-4 text-xs text-black/85 shadow-none transition-[background-color,color,scale] duration-200 hover:bg-black/10 hover:text-black focus-visible:ring-black/15 motion-safe:active:scale-[0.96] motion-reduce:transition-none dark:border-white/8 dark:bg-white/8 dark:text-white/85 dark:hover:bg-white/12 dark:hover:text-white dark:focus-visible:ring-white/20"
        onClick={onLoginClick}
      >
        <LogIn className="size-4" />
        <LanguageText>{translations.comments.loginToComment}</LanguageText>
      </Button>
    </div>
  )
}
