import type { CommentCardView } from './type'
import { Trash2 } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useCommentCardStore } from '@/store/use-comment-card-store'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'

export function CommentDeleteAction({
  commentId,
  displayName,
  view,
}: {
  commentId: number
  displayName: string
  view: CommentCardView
}) {
  const translations = useTranslations()
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const isConfirming = useCommentCardStore(state => state.deletingCommentId === commentId)
  const isPending = isConfirming && view.isDeletingComment
  const { onDeleteClick, onDeleteConfirm } = view

  useEffect(() => {
    if (!isConfirming || isPending) return

    cancelRef.current?.focus({ preventScroll: true })
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        onDeleteClick(null)
      }
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [isConfirming, isPending, onDeleteClick])

  const cancel = () => {
    onDeleteClick(null)
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }))
  }

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={translations.comments.deleteTitle}
      onBlur={event => {
        if (isConfirming && !isPending && !event.currentTarget.contains(event.relatedTarget)) {
          onDeleteClick(null)
        }
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' && isConfirming && !isPending) {
          event.preventDefault()
          event.stopPropagation()
          cancel()
        }
      }}
      className="relative h-7 w-[132px] shrink-0"
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleX: isConfirming ? 1 : 28 / 132, opacity: isConfirming ? 1 : 0 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 500, damping: 34, mass: 0.7 }
        }
        className="pointer-events-none absolute inset-0 origin-right rounded-lg bg-black/5 dark:bg-white/6"
      />
      <AnimatePresence initial={false}>
        {isConfirming ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: reducedMotion ? 0 : 6 }}
            animate={{ opacity: 1, x: 0, pointerEvents: 'auto' }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: reducedMotion ? 0 : 0.16 }}
            className="absolute inset-0 flex items-center gap-1 p-0.5"
          >
            <button
              ref={cancelRef}
              type="button"
              onClick={cancel}
              disabled={isPending}
              className="h-full min-w-0 flex-1 cursor-pointer rounded-md text-[11px] text-black/60 transition-[background-color,color,scale] outline-none hover:bg-black/5 hover:text-black focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-40 motion-safe:active:scale-[0.96] motion-reduce:transition-none dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white dark:focus-visible:ring-white/25"
            >
              <LanguageText>{translations.common.cancel}</LanguageText>
            </button>
            <button
              type="button"
              onClick={onDeleteConfirm}
              aria-label={translations.comments.deleteLabel(displayName)}
              aria-busy={isPending}
              disabled={isPending}
              className="relative h-full min-w-0 flex-1 cursor-pointer overflow-hidden rounded-md bg-red-500/10 text-[11px] text-red-600 transition-[background-color,color,scale] outline-none hover:bg-red-500/15 focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-inset disabled:pointer-events-none motion-safe:active:scale-[0.96] motion-reduce:transition-none dark:bg-red-400/10 dark:text-red-400 dark:hover:bg-red-400/15"
            >
              <LanguageText>{translations.comments.delete}</LanguageText>
              {isPending && (
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={reducedMotion ? { x: 0 } : { x: [-56, 56] }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { duration: 1, ease: 'easeInOut', repeat: Infinity }
                  }
                  className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-red-500/60 dark:bg-red-400/60"
                />
              )}
            </button>
            {isPending && (
              <span role="status" className="sr-only">
                {translations.common.pending}
              </span>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="delete"
            ref={triggerRef}
            type="button"
            aria-label={translations.comments.deleteLabel(displayName)}
            disabled={view.isDeletingComment}
            onClick={() => onDeleteClick(commentId)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, pointerEvents: 'auto' }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: reducedMotion ? 0 : 0.12 }}
            className="absolute top-0 right-0 flex size-7 cursor-pointer items-center justify-center rounded-lg text-black/45 transition-colors outline-none hover:bg-red-500/10 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none dark:text-white/45 dark:hover:bg-red-400/10 dark:hover:text-red-400 dark:focus-visible:ring-white/20"
          >
            <Trash2 aria-hidden className="size-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
