'use client'

import type { Ref, SyntheticEvent } from 'react'
import type { friendLinkApplyFields } from './constant'
import { CircleAlert } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
import { Input } from '@/ui/shadcn/input'

const validationTransition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] } as const

export function FriendLinkFormField({
  field,
  index,
  inputRef,
}: {
  field: (typeof friendLinkApplyFields)[number]
  index: number
  inputRef?: Ref<HTMLInputElement>
}) {
  const translations = useTranslations()
  const fieldTranslations = translations.friendLinkApplyModal.fields[field.name]
  const fieldId = `friend-link-apply-${field.name}`
  const controlRef = useRef<HTMLDivElement>(null)
  const shake = useRef<Animation | null>(null)
  const [validation, setValidation] = useState({ invalid: false, message: '' })
  const reducedMotion = useReducedMotion()

  useEffect(() => () => shake.current?.cancel(), [])

  const updateValidation = (input: HTMLInputElement) => {
    const invalid = !input.validity.valid
    const message = input.validationMessage
    setValidation(current =>
      current.invalid === invalid && current.message === message ? current : { invalid, message },
    )
  }

  const handleInvalid = (event: SyntheticEvent<HTMLInputElement>) => {
    event.preventDefault()
    updateValidation(event.currentTarget)

    const control = controlRef.current
    if (
      !control ||
      event.currentTarget.form?.querySelector('input:invalid') !== event.currentTarget ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    shake.current?.cancel()
    shake.current = control.animate(
      [
        { translate: '0 0' },
        { translate: '-4px 0' },
        { translate: '3px 0' },
        { translate: '-2px 0' },
        { translate: '1px 0' },
        { translate: '0 0' },
      ],
      { duration: 360, easing: 'ease-out' },
    )
  }

  return (
    <motion.div
      className="group/field"
      data-invalid={validation.invalid || undefined}
      layout={reducedMotion ? false : 'position'}
      transition={{ layout: validationTransition }}
    >
      <div
        ref={controlRef}
        className="motion-safe:animate-entry-text relative rounded-lg bg-white [animation-duration:300ms] dark:bg-zinc-950"
        style={{ animationDelay: `${index * 35}ms` }}
      >
        <Input
          ref={inputRef}
          id={fieldId}
          name={field.name}
          type={field.type}
          required={field.required}
          autoComplete={field.name === 'email' ? 'email' : undefined}
          placeholder={fieldTranslations.placeholder}
          aria-invalid={validation.invalid}
          aria-describedby={validation.invalid ? `${fieldId}-error` : undefined}
          onInvalid={handleInvalid}
          onInput={event => {
            if (validation.invalid) updateValidation(event.currentTarget)
          }}
          onBlur={event => {
            if (validation.invalid || event.currentTarget.value.length > 0) {
              updateValidation(event.currentTarget)
            }
          }}
          className="peer focus-visible:border-theme-primary/60 focus-visible:ring-theme-primary/10 h-11 rounded-lg border-black/15 bg-transparent text-base shadow-none transition-[border-color,box-shadow] duration-200 placeholder:text-transparent focus:placeholder:text-zinc-400 focus-visible:ring-2 aria-invalid:border-red-500 aria-invalid:ring-0 motion-reduce:transition-none md:text-sm dark:border-white/20 dark:bg-transparent dark:focus:placeholder:text-zinc-500 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-0"
        />
        <label
          htmlFor={fieldId}
          className="peer-focus:text-theme-primary absolute top-1/2 left-2.5 max-w-[calc(100%-1.5rem)] origin-left -translate-y-1/2 cursor-text truncate bg-white px-1 text-sm leading-5 text-zinc-500 transition-[translate,scale,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[invalid]/field:text-red-500 peer-focus:translate-y-[calc(-50%_-_var(--spacing)*5.5)] peer-focus:scale-[0.8] group-data-[invalid]/field:peer-focus:text-red-500 peer-[:not(:placeholder-shown)]:translate-y-[calc(-50%_-_var(--spacing)*5.5)] peer-[:not(:placeholder-shown)]:scale-[0.8] motion-reduce:transition-none dark:bg-zinc-950 dark:text-zinc-400 dark:group-data-[invalid]/field:text-red-400 dark:group-data-[invalid]/field:peer-focus:text-red-400"
        >
          <LanguageText className="truncate align-top">{fieldTranslations.label}</LanguageText>
        </label>
      </div>

      <div aria-live="polite" className="relative">
        <AnimatePresence initial={false} mode="popLayout">
          {validation.invalid && (
            <motion.p
              key="validation-error"
              id={`${fieldId}-error`}
              className="flex items-start gap-1.5 px-1 pt-1.5 text-xs leading-4 text-red-500 dark:text-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reducedMotion ? { duration: 0 } : validationTransition}
            >
              <CircleAlert aria-hidden className="mt-0.5 size-3 shrink-0" />
              {validation.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
