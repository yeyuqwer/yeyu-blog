import { useState } from 'react'
import { toast } from 'sonner'
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
  const { mutateAsync: toggleNotePublished, isPending } = useNotePublishMutation()

  const handleToggle = async () => {
    const newStatus = !isPublished
    setIsPublished(newStatus)

    try {
      await toggleNotePublished({
        id: noteId,
        isPublished: newStatus,
      })
      toast.success(`更新成功`)
    } catch (error) {
      setIsPublished(!newStatus)
      if (error instanceof Error) {
        toast.error(`发布状态更新失败 ${error.message}`)
      } else {
        toast.error(`发布状态更新失败`)
      }
    }
  }

  return <Switch onCheckedChange={handleToggle} checked={isPublished} disabled={isPending} />
}
