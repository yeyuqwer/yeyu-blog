'use client'

import type { Ref, SyntheticEvent } from 'react'
import type { friendLinkApplyFields } from './constant'
import { CircleAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { Input } from '@/ui/shadcn/input'

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

  useEffect(() => () => shake.current?.cancel(), [])

  const updateValidation = (input: HTMLInputElement) => {
    if (input.validity.valid) {
      setValidation(current => ({ ...current, invalid: false }))
      return
    }

    setValidation({ invalid: true, message: input.validationMessage })
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
    <div
      className="group/field motion-safe:animate-entry-text [animation-duration:300ms]"
      data-invalid={validation.invalid || undefined}
      style={{ animationDelay: `${index * 35}ms` }}
    >
      <div ref={controlRef} className="relative rounded-lg bg-white dark:bg-zinc-950">
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
          className="peer-focus:text-theme-primary absolute top-1/2 left-2.5 max-w-[calc(100%-1.5rem)] origin-left -translate-y-1/2 cursor-text truncate bg-white px-1 text-sm leading-5 text-zinc-500 transition-[top,scale,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[invalid]/field:text-red-500 peer-focus:top-0 peer-focus:scale-[0.8] group-data-[invalid]/field:peer-focus:text-red-500 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.8] motion-reduce:transition-none dark:bg-zinc-950 dark:text-zinc-400 dark:group-data-[invalid]/field:text-red-400 dark:group-data-[invalid]/field:peer-focus:text-red-400"
        >
          {fieldTranslations.label}
        </label>
      </div>

      <div
        className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 group-data-[invalid]/field:grid-rows-[1fr] group-data-[invalid]/field:opacity-100 motion-reduce:transition-none"
        aria-live="polite"
      >
        <div className="min-h-0 overflow-hidden">
          <p
            id={`${fieldId}-error`}
            aria-hidden={!validation.invalid}
            className="flex items-start gap-1.5 px-1 pt-1.5 text-xs leading-4 text-red-500 dark:text-red-400"
          >
            <CircleAlert aria-hidden className="mt-0.5 size-3 shrink-0" />
            {validation.message}
          </p>
        </div>
      </div>
    </div>
  )
}
