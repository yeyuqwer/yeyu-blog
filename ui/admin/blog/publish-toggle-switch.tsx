import { useState } from 'react'
import { toast } from 'sonner'
import { useBlogPublishMutation } from '@/hooks/api/blog'
import { Switch } from '@/ui/shadcn/switch'

export default function PublishToggleSwitch({
  blogId,
  isPublished: initial,
}: {
  blogId: number
  isPublished: boolean
}) {
  const [isPublished, setIsPublished] = useState(initial)
  const { mutateAsync: toggleBlogPublished, isPending } = useBlogPublishMutation()

  const handleToggle = async () => {
    const newStatus = !isPublished
    setIsPublished(newStatus)

    try {
      await toggleBlogPublished({
        id: blogId,
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
