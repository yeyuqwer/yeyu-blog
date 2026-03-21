'use client'

import type { ComponentProps, FC } from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useCommentConfigMutation, useCommentConfigQuery } from '@/hooks/api/comment'
import Loading from '@/ui/components/shared/loading'
import { Button } from '@/ui/shadcn/button'
import { Switch } from '@/ui/shadcn/switch'

export const CommentConfigManager: FC<ComponentProps<'main'>> = () => {
  const { data, isPending } = useCommentConfigQuery()
  const { mutateAsync: updateConfig, isPending: isUpdating } = useCommentConfigMutation()

  const [autoApproveEmailUsers, setAutoApproveEmailUsers] = useState(true)
  const [autoApproveWalletUsers, setAutoApproveWalletUsers] = useState(false)

  useEffect(() => {
    const config = data?.data
    if (config == null) {
      return
    }

    setAutoApproveEmailUsers(config.autoApproveEmailUsers)
    setAutoApproveWalletUsers(config.autoApproveWalletUsers)
  }, [data?.data])

  const currentConfig = data?.data
  const hasChanged =
    currentConfig != null &&
    (currentConfig.autoApproveEmailUsers !== autoApproveEmailUsers ||
      currentConfig.autoApproveWalletUsers !== autoApproveWalletUsers)

  const handleSave = async () => {
    try {
      await updateConfig({
        autoApproveEmailUsers,
        autoApproveWalletUsers,
      })
      toast.success('评论审核策略已更新。')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to update comment config.')
      }
    }
  }

  if (isPending) {
    return <Loading />
  }

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-3 overflow-hidden">
      <section className="rounded-sm border bg-background p-4 shadow-xs">
        <header className="mb-4">
          <h2 className="font-medium text-sm">评论审核策略</h2>
          <p className="mt-1 text-muted-foreground text-xs">
            控制博客和笔记评论在不同登录方式下是否自动通过。
          </p>
        </header>

        <div className="space-y-4">
          <section className="flex items-start justify-between gap-4 rounded-sm border bg-card p-3">
            <div className="min-w-0">
              <h3 className="font-medium text-sm">GitHub 登录用户自动通过</h3>
              <p className="mt-1 text-muted-foreground text-xs">
                关闭后，GitHub 登录用户提交评论也会进入待审核状态。
              </p>
            </div>
            <Switch
              checked={autoApproveEmailUsers}
              disabled={isUpdating}
              onCheckedChange={checked => {
                setAutoApproveEmailUsers(checked)
              }}
            />
          </section>

          <section className="flex items-start justify-between gap-4 rounded-sm border bg-card p-3">
            <div className="min-w-0">
              <h3 className="font-medium text-sm">钱包登录用户自动通过</h3>
              <p className="mt-1 text-muted-foreground text-xs">
                关闭后，钱包登录用户提交评论会进入待审核状态。
              </p>
            </div>
            <Switch
              checked={autoApproveWalletUsers}
              disabled={isUpdating}
              onCheckedChange={checked => {
                setAutoApproveWalletUsers(checked)
              }}
            />
          </section>
        </div>

        <footer className="mt-4 flex justify-end">
          <Button
            type="button"
            size="sm"
            className="cursor-pointer"
            disabled={isUpdating || !hasChanged}
            onClick={() => {
              void handleSave()
            }}
          >
            {isUpdating ? '保存中...' : '保存配置'}
          </Button>
        </footer>
      </section>
    </main>
  )
}
