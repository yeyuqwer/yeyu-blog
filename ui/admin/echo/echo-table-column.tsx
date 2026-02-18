'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { EchoRecord } from '@/lib/api/echo'
import { CalendarDays, Eye, Quote, TypeIcon, Wrench } from 'lucide-react'
import { prettyDateTime } from '@/lib/utils/time'
import { Button } from '@/ui/shadcn/button'
import ActionButtons from './action-buttons'
import PublishToggleSwitch from './publish-toggle-switch'

export const columns: ColumnDef<EchoRecord>[] = [
  {
    accessorKey: 'content',
    header: () => {
      return (
        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-200">
          <TypeIcon className="size-4" />
          内容
        </span>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-100 truncate" title={row.original.content}>
          {row.original.content}
        </div>
      )
    },
  },
  {
    accessorKey: 'reference',
    header: () => {
      return (
        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-200">
          <Quote className="size-4" />
          来源
        </span>
      )
    },
    cell: ({ row }) => {
      const reference = row.original.reference.toString()
      return <span>{reference}</span>
    },
  },
  {
    accessorKey: 'isPublished',
    header: () => {
      return (
        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-200">
          <Eye className="size-4" />
          是否发布
        </span>
      )
    },
    cell: ({ row }) => {
      return (
        <PublishToggleSwitch
          echoId={row.original.id}
          isPublished={row.original.isPublished}
          key={row.original.id}
        />
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
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
        </Button>
      )
    },
    cell: ({ row }) => {
      const prettyTime = prettyDateTime(new Date(row.original.createdAt))
      return <time>{prettyTime}</time>
    },
  },
  {
    accessorKey: 'actions',
    header: () => {
      return (
        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-200">
          <Wrench className="size-4" />
          操作
        </span>
      )
    },
    cell: ({ row }) => {
      const { id, content, isPublished, reference } = row.original

      return (
        <ActionButtons content={content} id={id} isPublished={isPublished} reference={reference} />
      )
    },
  },
]
