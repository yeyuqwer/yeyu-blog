import type { ComponentProps, FC, FormEvent } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@/ui/shadcn/input-group'

interface MutterFormProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  onCreate: () => void
  onValueChange: (value: string) => void
  value: string
}

export const MutterForm: FC<MutterFormProps> = ({
  className,
  onCreate,
  onValueChange,
  value,
  ...props
}) => {
  const canSubmit = value.trim().length > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    onCreate()
  }

  return (
    <form
      className={cn('h-40 max-h-40 min-h-40 shrink-0', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <InputGroup className="h-full min-h-0 has-[>[data-align=block-end]]:h-full has-[>textarea]:h-full">
        <InputGroupTextarea
          className="h-full min-h-0 overflow-y-auto [field-sizing:fixed]"
          placeholder="写点新的 mutter..."
          value={value}
          onChange={event => {
            onValueChange(event.target.value)
          }}
        />
        <InputGroupAddon align="block-end" className="shrink-0 justify-between border-t">
          <InputGroupText>{value.trim().length} 字</InputGroupText>
          <InputGroupButton
            type="submit"
            variant="secondary"
            size="sm"
            className="cursor-pointer"
            disabled={!canSubmit}
          >
            提交
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
