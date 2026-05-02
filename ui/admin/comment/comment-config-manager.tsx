'use client'

import type { ComponentProps, FC } from 'react'
import { useEffect, useState } from 'react'
import { sileo } from 'sileo'
import { useCommentConfigMutation, useCommentConfigQuery } from '@/hooks/api/comment'
import {
  useMutterCommentConfigMutation,
  useMutterCommentConfigQuery,
} from '@/hooks/api/mutter-comment'
import Loading from '@/ui/components/shared/loading'
import { Switch } from '@/ui/shadcn/switch'

const configRowClassName =
  'flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'

export const CommentConfigManager: FC<ComponentProps<'main'>> = () => {
  const { data: articleData, isPending: isArticlePending } = useCommentConfigQuery()
  const { data: mutterData, isPending: isMutterPending } = useMutterCommentConfigQuery()
  const { mutate: updateArticleConfig, isPending: isUpdatingArticle } = useCommentConfigMutation()
  const { mutate: updateMutterConfig, isPending: isUpdatingMutter } =
    useMutterCommentConfigMutation()

  const [articleAutoApproveEmailUsers, setArticleAutoApproveEmailUsers] = useState(true)
  const [articleAutoApproveWalletUsers, setArticleAutoApproveWalletUsers] = useState(false)
  const [mutterAutoApproveEmailUsers, setMutterAutoApproveEmailUsers] = useState(true)
  const [mutterAutoApproveWalletUsers, setMutterAutoApproveWalletUsers] = useState(false)

  useEffect(() => {
    const config = articleData?.data
    if (config == null) {
      return
    }

    setArticleAutoApproveEmailUsers(config.autoApproveEmailUsers)
    setArticleAutoApproveWalletUsers(config.autoApproveWalletUsers)
  }, [articleData?.data])

  useEffect(() => {
    const config = mutterData?.data
    if (config == null) {
      return
    }

    setMutterAutoApproveEmailUsers(config.autoApproveEmailUsers)
    setMutterAutoApproveWalletUsers(config.autoApproveWalletUsers)
  }, [mutterData?.data])

  const handleUpdateArticleConfig = (nextConfig: {
    autoApproveEmailUsers: boolean
    autoApproveWalletUsers: boolean
  }) => {
    updateArticleConfig(nextConfig, {
      onSuccess: () => {
        sileo.success({ title: '文章评论审核策略已更新' })
      },
      onError: error => {
        sileo.error({ title: error.message })
      },
    })
  }

  const handleUpdateMutterConfig = (nextConfig: {
    autoApproveEmailUsers: boolean
    autoApproveWalletUsers: boolean
  }) => {
    updateMutterConfig(nextConfig, {
      onSuccess: () => {
        sileo.success({ title: '低语评论审核策略已更新' })
      },
      onError: error => {
        sileo.error({ title: error.message })
      },
    })
  }

  if (isArticlePending || isMutterPending) {
    return <Loading />
  }

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-sm border bg-background">
      <header className="border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="font-medium text-sm">评论配置</h2>
          <p className="mt-1 text-muted-foreground text-xs">
            控制文章评论和低语评论在不同登录方式下是否自动通过。
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section>
          <header className="border-b bg-muted/30 px-4 py-2">
            <h3 className="font-medium text-xs">文章评论</h3>
          </header>
          <div className="divide-y">
            <section className={configRowClassName}>
              <div className="min-w-0">
                <h4 className="font-medium text-sm">GitHub 登录用户自动通过</h4>
                <p className="mt-1 text-muted-foreground text-xs">
                  关闭后，GitHub 登录用户提交文章评论也会进入待审核状态。
                </p>
              </div>
              <Switch
                className="shrink-0"
                checked={articleAutoApproveEmailUsers}
                disabled={isUpdatingArticle}
                onCheckedChange={checked => {
                  setArticleAutoApproveEmailUsers(checked)
                  handleUpdateArticleConfig({
                    autoApproveEmailUsers: checked,
                    autoApproveWalletUsers: articleAutoApproveWalletUsers,
                  })
                }}
              />
            </section>

            <section className={configRowClassName}>
              <div className="min-w-0">
                <h4 className="font-medium text-sm">钱包登录用户自动通过</h4>
                <p className="mt-1 text-muted-foreground text-xs">
                  关闭后，钱包登录用户提交文章评论会进入待审核状态。
                </p>
              </div>
              <Switch
                className="shrink-0"
                checked={articleAutoApproveWalletUsers}
                disabled={isUpdatingArticle}
                onCheckedChange={checked => {
                  setArticleAutoApproveWalletUsers(checked)
                  handleUpdateArticleConfig({
                    autoApproveEmailUsers: articleAutoApproveEmailUsers,
                    autoApproveWalletUsers: checked,
                  })
                }}
              />
            </section>
          </div>
        </section>

        <section>
          <header className="border-y bg-muted/30 px-4 py-2">
            <h3 className="font-medium text-xs">低语评论</h3>
          </header>
          <div className="divide-y">
            <section className={configRowClassName}>
              <div className="min-w-0">
                <h4 className="font-medium text-sm">GitHub 登录用户自动通过</h4>
                <p className="mt-1 text-muted-foreground text-xs">
                  关闭后，GitHub 登录用户提交低语评论也会进入待审核状态。
                </p>
              </div>
              <Switch
                className="shrink-0"
                checked={mutterAutoApproveEmailUsers}
                disabled={isUpdatingMutter}
                onCheckedChange={checked => {
                  setMutterAutoApproveEmailUsers(checked)
                  handleUpdateMutterConfig({
                    autoApproveEmailUsers: checked,
                    autoApproveWalletUsers: mutterAutoApproveWalletUsers,
                  })
                }}
              />
            </section>

            <section className={configRowClassName}>
              <div className="min-w-0">
                <h4 className="font-medium text-sm">钱包登录用户自动通过</h4>
                <p className="mt-1 text-muted-foreground text-xs">
                  关闭后，钱包登录用户提交低语评论会进入待审核状态。
                </p>
              </div>
              <Switch
                className="shrink-0"
                checked={mutterAutoApproveWalletUsers}
                disabled={isUpdatingMutter}
                onCheckedChange={checked => {
                  setMutterAutoApproveWalletUsers(checked)
                  handleUpdateMutterConfig({
                    autoApproveEmailUsers: mutterAutoApproveEmailUsers,
                    autoApproveWalletUsers: checked,
                  })
                }}
              />
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}
