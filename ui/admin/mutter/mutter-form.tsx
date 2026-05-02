import { type FC, type FormEvent, useEffect, useState } from 'react'
import { sileo } from 'sileo'
import { useMutterMutation } from '@/hooks/api/mutter'
import { useModalStore } from '@/store/use-modal-store'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@/ui/shadcn/input-group'

type MutterFormProps = {
  editingMutter: {
    id: number
    content: string
  } | null
  clearEditingMutter: () => void
}

export const MutterForm: FC<MutterFormProps> = ({ editingMutter, clearEditingMutter }) => {
  const setModalOpen = useModalStore(s => s.setModalOpen)
  const [draft, setDraft] = useState('')
  const { mutate: createMutter, isPending: isCreating } = useMutterMutation()
  const trimmedDraft = draft.trim()
  const canSubmit = trimmedDraft.length > 0
  const isEditing = editingMutter != null
  const hasContentChanged = isEditing ? trimmedDraft !== editingMutter.content.trim() : false

  useEffect(() => {
    if (editingMutter == null) {
      return
    }

    setDraft(editingMutter.content)
  }, [editingMutter])

  const handleCreateMutter = () => {
    const content = trimmedDraft
    if (content.length === 0) return

    createMutter(
      {
        content,
      },
      {
        onSuccess: () => {
          setDraft('')
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
      },
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || isCreating) return

    if (isEditing) {
      if (!hasContentChanged) return

      setModalOpen('updateMutterModal', {
        id: editingMutter.id,
        oldContent: editingMutter.content,
        newContent: trimmedDraft,
        onSuccess: () => {
          setDraft('')
          clearEditingMutter()
        },
      })
      return
    }

    handleCreateMutter()
  }

  return (
    <form className="h-36 max-h-36 min-h-36 shrink-0" onSubmit={handleSubmit}>
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
            disabled={!canSubmit || isCreating || (isEditing && !hasContentChanged)}
          >
            {isEditing ? '更新' : '提交'}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
