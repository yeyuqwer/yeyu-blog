'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { sileo } from 'sileo'
import { useCommentConfigMutation } from '@/hooks/api/comment/use-comment-config-mutation'
import { useCommentConfigQuery } from '@/hooks/api/comment/use-comment-config-query'
import Loading from '@/ui/components/shared/loading'
import { Switch } from '@/ui/shadcn/switch'

function CommentConfigSection({
  title,
  config,
  emailDescription,
  walletDescription,
  isUpdating,
  onUpdate,
}: {
  title: string
  config: {
    autoApproveEmailUsers: boolean
    autoApproveWalletUsers: boolean
  }
  emailDescription: string
  walletDescription: string
  isUpdating: boolean
  onUpdate: (nextConfig: {
    autoApproveEmailUsers: boolean
    autoApproveWalletUsers: boolean
  }) => void
}) {
  const [emailUsersOverride, setEmailUsersOverride] = useState<boolean | null>(null)
  const [walletUsersOverride, setWalletUsersOverride] = useState<boolean | null>(null)
  const autoApproveEmailUsers =
    emailUsersOverride === null ? config.autoApproveEmailUsers : emailUsersOverride
  const autoApproveWalletUsers =
    walletUsersOverride === null ? config.autoApproveWalletUsers : walletUsersOverride

  return (
    <section>
      <header className="bg-muted/30 border-b px-4 py-2">
        <h3 className="text-xs font-medium">{title}</h3>
      </header>
      <div className="divide-y">
        <section className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h4 className="text-sm font-medium">GitHub 登录用户自动通过</h4>
            <p className="text-muted-foreground mt-1 text-xs">{emailDescription}</p>
          </div>
          <Switch
            className="shrink-0"
            checked={autoApproveEmailUsers}
            disabled={isUpdating}
            onCheckedChange={checked => {
              setEmailUsersOverride(checked)
              onUpdate({
                autoApproveEmailUsers: checked,
                autoApproveWalletUsers,
              })
            }}
          />
        </section>

        <section className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h4 className="text-sm font-medium">钱包登录用户自动通过</h4>
            <p className="text-muted-foreground mt-1 text-xs">{walletDescription}</p>
          </div>
          <Switch
            className="shrink-0"
            checked={autoApproveWalletUsers}
            disabled={isUpdating}
            onCheckedChange={checked => {
              setWalletUsersOverride(checked)
              onUpdate({
                autoApproveEmailUsers,
                autoApproveWalletUsers: checked,
              })
            }}
          />
        </section>
      </div>
    </section>
  )
}

export const CommentConfigManager: FC<ComponentProps<'main'>> = () => {
  const { data: articleData, isPending: isArticlePending } = useCommentConfigQuery()
  const { mutate: updateArticleConfig, isPending: isUpdatingArticle } = useCommentConfigMutation()

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

  const articleConfig = articleData?.data

  if (isArticlePending || articleConfig == null) {
    return <Loading />
  }

  return (
    <main className="bg-background flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-sm border">
      <header className="border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-medium">评论配置</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            控制文章评论在不同登录方式下是否自动通过。
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <CommentConfigSection
          key={`article-${articleConfig.autoApproveEmailUsers}-${articleConfig.autoApproveWalletUsers}`}
          title="文章评论"
          config={articleConfig}
          emailDescription="关闭后，GitHub 登录用户提交文章评论也会进入待审核状态。"
          walletDescription="关闭后，钱包登录用户提交文章评论会进入待审核状态。"
          isUpdating={isUpdatingArticle}
          onUpdate={handleUpdateArticleConfig}
        />
      </div>
    </main>
  )
}
