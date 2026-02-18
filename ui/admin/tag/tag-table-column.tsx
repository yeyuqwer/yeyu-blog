'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { WithCountTagDTO } from '@/lib/api/tag'
import { ArrowDown, ArrowUp, FileText, TagsIcon, TypeIcon, Wrench } from 'lucide-react'
import TagItemBadge from '@/ui/components/shared/tag-item-badge'
import { Badge } from '@/ui/shadcn/badge'
import { Button } from '@/ui/shadcn/button'
import ActionButtons from './action-buttons'

// * 后序整一个分类排序
export const columns: ColumnDef<WithCountTagDTO>[] = [
  {
    accessorKey: 'tagName',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <TypeIcon className="size-4" />
          标签名
        </span>
      )
    },
    cell: ({ row }) => {
      return <TagItemBadge tag={row.original.tagName} />
    },
  },
  {
    accessorKey: 'tagType',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <TagsIcon className="size-4" />
          标签类型
        </span>
      )
    },
    cell: ({ row }) => {
      const tagType = row.original.tagType
      return <Badge className="font-mono">{tagType}</Badge>
    },
  },
  {
    accessorKey: 'count',
    header: ({ column }) => {
      const sorted = column.getIsSorted()

      return (
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <FileText className="size-4" />
          关联文章数量
          {sorted === 'asc' ? <ArrowUp /> : sorted === 'desc' ? <ArrowDown /> : null}
        </Button>
      )
    },
    cell: ({ row }) => {
      const relatedArticleCount = row.original.count
      return (
        <div className="flex max-w-36 justify-center font-mono text-base">
          {relatedArticleCount}
        </div>
      )
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
      const { id, tagName, tagType } = row.original

      return <ActionButtons id={id} tagName={tagName} tagType={tagType} />
    },
  },
]
