'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useEchoPublishMutation } from '@/hooks/api/echo'
import { Switch } from '@/ui/shadcn/switch'

export default function PublishToggleSwitch({
  echoId,
  isPublished: initial,
}: {
  echoId: number
  isPublished: boolean
}) {
  const [isPublished, setIsPublished] = useState(initial)
  const { mutateAsync: toggleEchoPublish, isPending } = useEchoPublishMutation()

  const handleToggle = async () => {
    const newStatus = !isPublished
    setIsPublished(newStatus)

    try {
      await toggleEchoPublish({
        id: echoId,
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
