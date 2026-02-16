import type { FC, FormEvent } from 'react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useMutterMutation } from '@/hooks/api/mutter'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@/ui/shadcn/input-group'

export const MutterForm: FC = () => {
  const [draft, setDraft] = useState('')
  const { mutateAsync: createMutter, isPending: isCreating } = useMutterMutation()
  const canSubmit = draft.trim().length > 0

  const handleCreateMutter = async () => {
    const content = draft.trim()
    if (content.length === 0) return

    try {
      await createMutter({
        content,
      })
      setDraft('')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to create mutter.')
      }
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || isCreating) return
    void handleCreateMutter()
  }

  return (
    <form className="h-40 max-h-40 min-h-40 shrink-0" onSubmit={handleSubmit}>
      <InputGroup className="h-full min-h-0 has-[>[data-align=block-end]]:h-full has-[>textarea]:h-full">
        <InputGroupTextarea
          className="field-sizing-fixed h-full min-h-0 overflow-y-auto"
          placeholder="碎碎念..."
          value={draft}
          onChange={event => {
            setDraft(event.target.value)
          }}
        />
        <InputGroupAddon align="block-end" className="shrink-0 justify-between border-t">
          <InputGroupText>{draft.trim().length} 字</InputGroupText>
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
