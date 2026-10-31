import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { LanguageText } from '@/ui/components/shared/language-text'
import { Button } from '@/ui/shadcn/button'

export function ModalActionButton({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={cn(
        'transition-[background-color,border-color,color,box-shadow,scale] duration-150 motion-safe:active:scale-[0.98] motion-reduce:transition-none',
        className,
      )}
    />
  )
}

export function ModalActionLabel({
  label,
  activeLabel,
  active,
}: {
  label: string
  activeLabel: string
  active: boolean
}) {
  return (
    <span className="group/action-label grid" data-active={active || undefined} aria-live="polite">
      <span
        aria-hidden={active}
        className="col-start-1 row-start-1 transition-[opacity,translate] duration-200 group-data-[active]/action-label:-translate-y-1 group-data-[active]/action-label:opacity-0 motion-reduce:transition-none"
      >
        <LanguageText>{label}</LanguageText>
      </span>
      <span
        aria-hidden={!active}
        className="col-start-1 row-start-1 translate-y-1 opacity-0 transition-[opacity,translate] duration-200 group-data-[active]/action-label:translate-y-0 group-data-[active]/action-label:opacity-100 motion-reduce:transition-none"
      >
        <LanguageText>{activeLabel}</LanguageText>
      </span>
    </span>
  )
}
