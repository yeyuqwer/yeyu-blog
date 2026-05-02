'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { useAdminCommentQuery } from '@/hooks/api/comment'
import { useAdminMutterCommentQuery } from '@/hooks/api/mutter-comment'
import { formatPendingCount } from '@/lib/utils/common/format-pending-count'
import { cn } from '@/lib/utils/common/shadcn'
import { Button } from '@/ui/shadcn/button'
import { CommentConfigManager } from './comment-config-manager'
import { CommentManager } from './comment-manager'
import { MutterCommentManager } from './mutter-comment-manager'

export const CommentPage: FC<ComponentProps<'main'>> = () => {
  const [mode, setMode] = useState<'comment' | 'mutterComment' | 'commentConfig'>('comment')
  const { data: commentData } = useAdminCommentQuery({
    state: 'PENDING',
    take: 1,
    skip: 0,
  })
  const { data: mutterCommentData } = useAdminMutterCommentQuery({
    state: 'PENDING',
    take: 1,
    skip: 0,
  })
  const pendingCount = commentData?.total ?? 0
  const mutterPendingCount = mutterCommentData?.total ?? 0

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-2">
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
            <span className="pointer-events-none absolute right-0 bottom-0 z-10 inline-flex min-w-5 translate-x-1/3 translate-y-1/3 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 font-medium text-[10px] text-white leading-none shadow-xs">
              {formatPendingCount(pendingCount)}
            </span>
          ) : null}
        </div>
        <div className="relative inline-flex overflow-visible">
          <Button
            type="button"
            size="sm"
            className={cn('cursor-pointer', mutterPendingCount > 0 && 'pr-5')}
            variant={mode === 'mutterComment' ? 'default' : 'outline'}
            onClick={() => {
              setMode('mutterComment')
            }}
          >
            低语评论
          </Button>
          {mutterPendingCount > 0 ? (
            <span className="pointer-events-none absolute right-0 bottom-0 z-10 inline-flex min-w-5 translate-x-1/3 translate-y-1/3 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 font-medium text-[10px] text-white leading-none shadow-xs">
              {formatPendingCount(mutterPendingCount)}
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

      {mode === 'comment' ? (
        <CommentManager />
      ) : mode === 'mutterComment' ? (
        <MutterCommentManager />
      ) : (
        <CommentConfigManager />
      )}
    </main>
  )
}
