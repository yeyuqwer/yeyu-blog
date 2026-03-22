'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { useAdminMutterCommentQuery } from '@/hooks/api/mutter-comment'
import { formatPendingCount } from '@/lib/utils/common/format-pending-count'
import { cn } from '@/lib/utils/common/shadcn'
import { Button } from '@/ui/shadcn/button'
import { MutterCommentConfigManager } from './mutter-comment-config-manager'
import { MutterCommentManager } from './mutter-comment-manager'
import { MutterForm } from './mutter-form'
import { MutterList } from './mutter-list'
import { MutterSearch } from './mutter-search'

export const MutterPage: FC<ComponentProps<'main'>> = () => {
  const [mode, setMode] = useState<'mutter' | 'comment' | 'commentConfig'>('mutter')
  const [editingMutter, setEditingMutter] = useState<{
    id: number
    content: string
  } | null>(null)
  const [query, setQuery] = useState('')
  const { data: commentData } = useAdminMutterCommentQuery({
    state: 'PENDING',
    take: 1,
    skip: 0,
  })
  const pendingCount = commentData?.total ?? 0

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      <header className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="cursor-pointer"
          variant={mode === 'mutter' ? 'default' : 'outline'}
          onClick={() => {
            setMode('mutter')
          }}
        >
          低语管理
        </Button>
        <div className="relative inline-flex overflow-visible">
          <Button
            type="button"
            size="sm"
            className={cn('cursor-pointer', pendingCount > 0 && 'pr-5')}
            variant={mode === 'comment' ? 'default' : 'outline'}
            onClick={() => {
              setMode('comment')
            }}
          >
            评论管理
          </Button>
          {pendingCount > 0 ? (
            <span className="pointer-events-none absolute right-0 bottom-0 z-10 inline-flex min-w-5 translate-x-1/3 translate-y-1/3 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 font-medium text-[10px] text-white leading-none shadow-xs">
              {formatPendingCount(pendingCount)}
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          size="sm"
          className="cursor-pointer"
          variant={mode === 'commentConfig' ? 'default' : 'outline'}
          onClick={() => {
            setMode('commentConfig')
          }}
        >
          评论配置
        </Button>
      </header>

      {mode === 'mutter' ? (
        <>
          <MutterSearch setQuery={setQuery} />

          <MutterList query={query} onEditMutter={setEditingMutter} />

          <MutterForm
            editingMutter={editingMutter}
            clearEditingMutter={() => setEditingMutter(null)}
          />
        </>
      ) : mode === 'comment' ? (
        <MutterCommentManager />
      ) : (
        <MutterCommentConfigManager />
      )}
    </main>
  )
}
