'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Toggle } from '@/ui/shadcn/toggle'

export function BlogTagItemToggle({
  tag,
  setSelectedTags,
}: {
  tag: string
  setSelectedTags: Dispatch<SetStateAction<string[]>>
}) {
  return (
    <Toggle
      variant="outline"
      size="sm"
      className="max-w-48 cursor-pointer truncate"
      title={tag}
      onPressedChange={selected => {
        setSelectedTags(beforeSelectedTags =>
          selected ? [...beforeSelectedTags, tag] : beforeSelectedTags.filter(t => t !== tag),
        )
      }}
    >
      {tag}
    </Toggle>
  )
}
