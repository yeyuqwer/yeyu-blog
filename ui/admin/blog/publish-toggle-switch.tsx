import { useState } from 'react'
import { sileo } from 'sileo'
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
  const { mutate: toggleBlogPublished, isPending } = useBlogPublishMutation()

  const handleToggle = () => {
    const newStatus = !isPublished
    setIsPublished(newStatus)

    toggleBlogPublished(
      {
        id: blogId,
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
