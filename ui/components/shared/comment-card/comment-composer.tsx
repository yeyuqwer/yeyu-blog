import type { SessionAvatarProps } from './type'
import { CornerUpLeft, X } from 'lucide-react'
import { Button } from '@/ui/shadcn/button'
import { Textarea } from '@/ui/shadcn/textarea'
import { SessionAvatar } from './comment-avatar'
import { maxCommentLength } from './constant'

export function CommentComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  placeholder,
  submitLabel,
  helperText,
  sessionAvatarProps,
  autoFocus = false,
  onCancel,
  title,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  placeholder: string
  submitLabel: string
  helperText: string
  sessionAvatarProps: SessionAvatarProps
  autoFocus?: boolean
  onCancel?: () => void
  title?: string
}) {
  const trimmedContent = value.trim()
  const inputExceeded = trimmedContent.length > maxCommentLength

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {title != null ? (
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <CornerUpLeft className="size-3.5" />
            <span>{title}</span>
          </div>
        ) : null}
        <Textarea
          placeholder={placeholder}
          value={value}
          autoFocus={autoFocus}
          onChange={event => {
            onChange(event.target.value)
          }}
          className="min-h-24 resize-none rounded-xl border-zinc-300 bg-white/70 text-sm text-zinc-900 shadow-none placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:ring-theme-ring/25 dark:border-zinc-700 dark:bg-zinc-900/55 dark:text-zinc-100 dark:focus-visible:border-zinc-600 dark:placeholder:text-zinc-500"
        />
        <div className="flex items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="min-w-0 truncate">{helperText}</span>
          <span className={inputExceeded ? 'shrink-0 text-red-500 dark:text-red-400' : 'shrink-0'}>
            {trimmedContent.length}/{maxCommentLength}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <SessionAvatar {...sessionAvatarProps} />

        <div className="flex items-center gap-2">
          {onCancel != null ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              className="h-9 rounded-xl px-3 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              <X className="size-4" />
              取消
            </Button>
          ) : null}
          <Button
            type="button"
            className="h-9 shrink-0 rounded-xl bg-theme-indicator px-4 text-theme-active-text shadow-none hover:bg-[color-mix(in_srgb,var(--theme-indicator)_92%,black)] hover:text-theme-active-text focus-visible:ring-theme-ring/35 disabled:cursor-not-allowed disabled:bg-theme-indicator disabled:text-theme-active-text disabled:opacity-45"
            disabled={trimmedContent.length === 0 || inputExceeded || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? '稍等' : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
