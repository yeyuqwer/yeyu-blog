import { CornerUpLeft, LoaderCircle } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useId, useState } from 'react'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
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
  const countId = useId()
  const [isFocused, setIsFocused] = useState(false)
  const reducedMotion = useReducedMotion()
  const trimmedContent = value.trim()
  const inputExceeded = trimmedContent.length > maxCommentLength
  const isExpanded = isFocused || value.length > 0

  return (
    <div
      className="min-w-0"
      onFocus={() => setIsFocused(true)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false)
      }}
    >
      {title != null ? (
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-black/70 dark:text-white/70">
          <CornerUpLeft className="size-3.5 text-black/70 dark:text-white/70" />
          <LanguageText>{title}</LanguageText>
        </div>
      ) : null}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 160 : 112 }}
        transition={
          reducedMotion ? { duration: 0 } : { type: 'spring', bounce: 0.22, duration: 0.42 }
        }
        style={{ borderRadius: 20 }}
        className="flex flex-col overflow-hidden border border-black/12 bg-white/80 transition-[border-color,box-shadow] duration-160 focus-within:border-black/35 focus-within:shadow-[0_0_0_1px_rgba(0,0,0,0.04)] motion-reduce:transition-none dark:border-white/12 dark:bg-white/[0.035] dark:focus-within:border-white/35 dark:focus-within:shadow-none"
      >
        <Textarea
          placeholder={placeholder}
          value={value}
          readOnly={isSubmitting}
          aria-label={title == null ? translations.comments.title : title}
          aria-invalid={inputExceeded}
          aria-describedby={countId}
          onChange={event => {
            onChange(event.target.value)
          }}
          className="field-sizing-fixed h-auto min-h-0 flex-1 resize-none overflow-y-auto rounded-none border-0 bg-transparent px-4 py-2 text-sm leading-5 text-black/85 shadow-none placeholder:text-black/40 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent dark:text-white/90 dark:placeholder:text-white/40 dark:aria-invalid:ring-0"
        />
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-3 pt-1 pb-3">
          <span
            id={countId}
            className={
              inputExceeded
                ? 'shrink-0 font-mono text-[11px] text-red-500 dark:text-red-400'
                : 'shrink-0 font-mono text-[11px] text-black/55 dark:text-white/55'
            }
          >
            {trimmedContent.length}/{maxCommentLength}
          </span>

          <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2">
            {onCancel != null ? (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
                className="h-8 rounded-xl px-3 text-xs text-black/55 transition-[background-color,color,scale] duration-200 hover:bg-black/5 hover:text-black motion-safe:active:scale-[0.96] motion-reduce:transition-none dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <LanguageText>{translations.common.cancel}</LanguageText>
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              className="h-8 shrink-0 rounded-xl border border-black/8 bg-black/6 px-4 text-xs text-black/85 shadow-none transition-[background-color,color,scale] duration-200 hover:bg-black/10 hover:text-black focus-visible:ring-black/15 disabled:cursor-not-allowed disabled:text-black/35 disabled:opacity-100 motion-safe:active:scale-[0.96] motion-reduce:transition-none dark:border-white/8 dark:bg-white/8 dark:text-white/85 dark:hover:bg-white/12 dark:hover:text-white dark:focus-visible:ring-white/20 dark:disabled:text-white/35"
              disabled={trimmedContent.length === 0 || inputExceeded || isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting && (
                <LoaderCircle aria-hidden className="size-3.5 motion-safe:animate-spin" />
              )}
              <LanguageText>
                {isSubmitting ? translations.common.pending : submitLabel}
              </LanguageText>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
