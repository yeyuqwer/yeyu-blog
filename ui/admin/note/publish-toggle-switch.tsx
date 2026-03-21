import { useState } from 'react'
import { sileo } from 'sileo'
import { useNotePublishMutation } from '@/hooks/api/note'
import { Switch } from '@/ui/shadcn/switch'

export default function PublishToggleSwitch({
  noteId,
  isPublished: initial,
}: {
  noteId: number
  isPublished: boolean
}) {
  const [isPublished, setIsPublished] = useState(initial)
  const { mutate: toggleNotePublished, isPending } = useNotePublishMutation()

  const handleToggle = () => {
    const newStatus = !isPublished
    setIsPublished(newStatus)

    toggleNotePublished(
      {
        id: noteId,
        isPublished: newStatus,
      },
      {
        onSuccess: () => {
          sileo.success({ title: '更新成功' })
        },
        onError: error => {
          setIsPublished(!newStatus)
          sileo.error({ title: `发布状态更新失败 ${error.message}` })
        },
      },
    )
  }

  return <Switch onCheckedChange={handleToggle} checked={isPublished} disabled={isPending} />
}
