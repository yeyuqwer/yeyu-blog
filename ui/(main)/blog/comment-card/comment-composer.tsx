import { CornerUpLeft, X } from 'lucide-react'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { Button } from '@/ui/shadcn/button'
import { Textarea } from '@/ui/shadcn/textarea'
import { maxCommentLength } from './constant'

export function CommentComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  placeholder,
  submitLabel,
  onCancel,
  title,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  placeholder: string
  submitLabel: string
  onCancel?: () => void
  title?: string
}) {
  const translations = useTranslations()
  const trimmedContent = value.trim()
  const inputExceeded = trimmedContent.length > maxCommentLength

  return (
    <div className="min-w-0">
      {title != null ? (
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-black/70 dark:text-white/70">
          <CornerUpLeft className="size-3.5 text-black/70 dark:text-white/70" />
          <span>{title}</span>
        </div>
      ) : null}
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={event => {
          onChange(event.target.value)
        }}
        className="min-h-24 resize-none rounded-lg border-black/20 bg-transparent px-3.5 py-3 text-sm text-black shadow-none placeholder:text-black/45 focus-visible:border-black/45 focus-visible:ring-black/20 dark:border-white/20 dark:bg-transparent dark:text-white dark:placeholder:text-white/45 dark:focus-visible:border-white/55 dark:focus-visible:ring-white/25"
      />
      <div className="mt-2 flex items-center justify-end gap-3">
        <span
          className={
            inputExceeded
              ? 'shrink-0 font-mono text-xs text-red-500 dark:text-red-400'
              : 'shrink-0 font-mono text-xs text-black/55 dark:text-white/55'
          }
        >
          {trimmedContent.length}/{maxCommentLength}
        </span>

        <div className="flex items-center gap-2">
          {onCancel != null ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              className="h-8 rounded-lg px-3 text-black/65 hover:bg-black/5 hover:text-black dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="size-4" />
              {translations.common.cancel}
            </Button>
          ) : null}
          <Button
            type="button"
            className="h-8 shrink-0 rounded-lg bg-black px-4 text-white shadow-[0_6px_16px_rgba(0,0,0,0.16)] hover:bg-zinc-800 hover:text-white focus-visible:ring-black/25 disabled:cursor-not-allowed disabled:bg-black disabled:text-white disabled:opacity-45 dark:bg-white dark:text-black dark:shadow-[0_6px_16px_rgba(0,0,0,0.28)] dark:hover:bg-zinc-200 dark:hover:text-black dark:focus-visible:ring-white/30 dark:disabled:bg-white dark:disabled:text-black"
            disabled={trimmedContent.length === 0 || inputExceeded || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? translations.common.pending : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
