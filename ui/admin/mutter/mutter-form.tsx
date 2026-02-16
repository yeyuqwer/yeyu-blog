import type { FC, FormEvent } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@/ui/shadcn/input-group'

export const MutterForm: FC<{
  className?: string
  isCreating?: boolean
  onCreate: () => Promise<void> | void
  onValueChange: (value: string) => void
  value: string
}> = ({ className, isCreating = false, onCreate, onValueChange, value }) => {
  const canSubmit = value.trim().length > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || isCreating) return
    void onCreate()
  }

  return (
    <form className={cn('h-40 max-h-40 min-h-40 shrink-0', className)} onSubmit={handleSubmit}>
      <InputGroup className="h-full min-h-0 has-[>[data-align=block-end]]:h-full has-[>textarea]:h-full">
        <InputGroupTextarea
          className="field-sizing-fixed h-full min-h-0 overflow-y-auto"
          placeholder="碎碎念..."
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
            disabled={!canSubmit || isCreating}
          >
            提交
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
