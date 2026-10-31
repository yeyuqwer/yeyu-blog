'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { useAdminPendingCountQuery } from '@/hooks/api/admin/use-admin-pending-count-query'
import { formatPendingCount } from '@/lib/utils/common/format-pending-count'
import { cn } from '@/lib/utils/common/shadcn'
import { Button } from '@/ui/shadcn/button'
import { CommentConfigManager } from './comment-config-manager'
import { CommentManager } from './comment-manager'

export const CommentPage: FC<ComponentProps<'main'>> = () => {
  const [mode, setMode] = useState<'comment' | 'commentConfig'>('comment')
  const { data: pendingCountData } = useAdminPendingCountQuery()
  const pendingCount = pendingCountData?.siteCommentPendingCount ?? 0

  return (
    <main className="flex h-[calc(100dvh-5rem)] min-h-0 w-full flex-col gap-2 pb-4">
      <header className="flex flex-wrap items-center gap-2">
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
            文章评论
          </Button>
          {pendingCount > 0 ? (
            <span className="bg-destructive pointer-events-none absolute right-0 bottom-0 z-10 inline-flex min-w-5 translate-x-1/3 translate-y-1/3 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] leading-none font-medium text-white shadow-xs">
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

      {mode === 'comment' ? <CommentManager /> : <CommentConfigManager />}
    </main>
  )
}
