'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { Button } from '@/ui/shadcn/button'
import { CommentConfigManager } from './comment-config-manager'
import { CommentManager } from './comment-manager'

export const CommentPage: FC<ComponentProps<'main'>> = () => {
  const [mode, setMode] = useState<'comment' | 'commentConfig'>('comment')

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      <header className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="cursor-pointer"
          variant={mode === 'comment' ? 'default' : 'outline'}
          onClick={() => {
            setMode('comment')
          }}
        >
          评论管理
        </Button>
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
