'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { NoteListItem } from '@/lib/api/note'
import { ArrowDown, ArrowUp, CalendarDays, Eye, TagIcon, TypeIcon, Wrench } from 'lucide-react'
import { prettyDateTime } from '@/lib/utils/time'
import TagItemBadge from '@/ui/components/shared/tag-item-badge'
import { Button } from '@/ui/shadcn/button'
import ActionButtons from './action-buttons'
import PublishToggleSwitch from './publish-toggle-switch'

export const columns: ColumnDef<NoteListItem>[] = [
  {
    accessorKey: 'title',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <TypeIcon className="size-4" />
          标题
        </span>
      )
    },
  },
  {
    accessorKey: 'tags',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <TagIcon className="size-4" />
          标签
        </span>
      )
    },
    cell: ({ row }) => {
      const tags = row.original.tags
      return (
        <div className="flex items-center gap-1">
          {tags.map(tag => (
            <TagItemBadge tag={tag.tagName} key={tag.id} />
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'isPublished',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <Eye className="size-4" />
          是否发布
        </span>
      )
    },
    cell: ({ row }) => {
      const note = row.original

      return <PublishToggleSwitch noteId={note.id} isPublished={note.isPublished} key={note.id} />
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      const sorted = column.getIsSorted()

      return (
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          <CalendarDays className="size-4" />
          创建时间
          {sorted === 'asc' ? <ArrowUp /> : sorted === 'desc' ? <ArrowDown /> : null}
        </Button>
      )
    },
    cell: ({ row }) => {
      const prettyTime = prettyDateTime(new Date(row.original.createdAt))
      return <span>{prettyTime}</span>
    },
  },
  {
    accessorKey: 'actions',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <Wrench className="size-4" />
          操作
        </span>
      )
    },
    cell: ({ row }) => {
      const { id, slug, title } = row.original

      return <ActionButtons noteId={id} slug={slug} title={title} />
    },
  },
]
