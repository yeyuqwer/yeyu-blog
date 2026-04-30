'use client'

import type { ComponentProps, FC, FormEvent } from 'react'
import type { CreateFriendLinkParams } from '@/lib/api/friend-link'
import { useEffect, useRef, useState } from 'react'
import { useFriendLinkMutation } from '@/hooks/api/friend-link'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { CheckIcon } from '@/ui/shadcn/check'
import { CopyIcon } from '@/ui/shadcn/copy'
import { copyToClipboard } from '@/ui/shadcn/copy-button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { SendIcon, type SendIconHandle } from '@/ui/shadcn/send'

const friendLinkApplyFields = [
  {
    name: 'name',
    label: '站点名称',
    placeholder: `叶鱼 & 业余`,
    type: 'text',
  },
  {
    name: 'description',
    label: '站点描述',
    placeholder: '业余全栈开发',
    type: 'text',
  },
  {
    name: 'avatarUrl',
    label: '头像地址',
    placeholder: 'https://avatars.githubusercontent.com/u/140394258',
    type: 'url',
  },
  {
    name: 'siteUrl',
    label: '站点地址',
    placeholder: 'https://www.useyeyu.cc/',
    type: 'url',
  },
] satisfies {
  name: keyof CreateFriendLinkParams
  label: string
  placeholder: string
  type?: ComponentProps<'input'>['type']
}[]

const friendLinkSiteInfo = `${friendLinkApplyFields[0].label}：${friendLinkApplyFields[0].placeholder}
${friendLinkApplyFields[1].label}：${friendLinkApplyFields[1].placeholder}
${friendLinkApplyFields[2].label}：${friendLinkApplyFields[2].placeholder}
${friendLinkApplyFields[3].label}：${friendLinkApplyFields[3].placeholder}`

export const FriendLinkApplyModal: FC<ComponentProps<'div'>> = () => {
  const modalType = useModalStore(s => s.modalType)
  const closeModal = useModalStore(s => s.closeModal)
  const isModalOpen = modalType === 'friendLinkApplyModal'
  const sendIconRef = useRef<SendIconHandle>(null)
  const copyStatusIconRef = useRef<SendIconHandle>(null)
  const copyResetTimerRef = useRef<number | null>(null)
  const [isSiteInfoCopied, setIsSiteInfoCopied] = useState(false)
  const { mutate: createFriendLink, isPending: isSubmitting } = useFriendLinkMutation()

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current !== null) {
        window.clearTimeout(copyResetTimerRef.current)
      }
    }
  }, [])

  const handleCopySiteInfo = async () => {
    await copyToClipboard(friendLinkSiteInfo)

    if (copyResetTimerRef.current !== null) {
      window.clearTimeout(copyResetTimerRef.current)
    }

    setIsSiteInfoCopied(true)
    copyResetTimerRef.current = window.setTimeout(() => {
      setIsSiteInfoCopied(false)
    }, 2000)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = friendLinkApplyFields.reduce(
      (result, field) => ({
        ...result,
        [field.name]: String(formData.get(field.name) ?? ''),
      }),
      {} as CreateFriendLinkParams,
    )

    createFriendLink(payload, {
      onSuccess: () => {
        form.reset()
        closeModal()
      },
    })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-h-[88vh] overflow-hidden rounded-xl border-black/10 bg-theme-background/80 p-0 shadow-[0_18px_54px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:max-w-[500px] dark:border-white/10 dark:bg-black/70 dark:shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
        <div className="max-h-[88vh] overflow-y-auto p-6 [scrollbar-color:rgba(113,113,122,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[3px]">
          <DialogHeader className="items-center gap-2 border-black/10 border-b px-8 pb-5 text-center dark:border-white/10">
            <DialogTitle className="font-bold text-xl text-zinc-900 tracking-normal dark:text-zinc-100">
              申请友链
            </DialogTitle>
            <DialogDescription className="text-center text-[11px] text-zinc-500 leading-5 dark:text-zinc-400">
              <span className="block">申请说明：技术博客或生活记录，需 HTTPS、无广告 ~</span>
              <span className="block">已添加本站 / 站点可访问 / 内容合规 ~</span>
            </DialogDescription>
          </DialogHeader>

          <form className="mt-5 grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {friendLinkApplyFields.map(field => {
                const fieldId = `friend-link-apply-${field.name}`

                return (
                  <div key={field.name} className="grid gap-2">
                    <Label
                      htmlFor={fieldId}
                      className="font-medium text-sm text-zinc-700 dark:text-zinc-200"
                    >
                      {field.label}
                    </Label>
                    <Input
                      id={fieldId}
                      name={field.name}
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      className="h-10 rounded-xl border-black/10 bg-theme-background/65 text-sm shadow-none placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:ring-zinc-400/25 dark:border-white/10 dark:bg-zinc-900/70 dark:focus-visible:border-zinc-500 dark:focus-visible:ring-zinc-500/25 dark:placeholder:text-zinc-500"
                    />
                  </div>
                )
              })}
            </div>

            <DialogFooter className="items-stretch border-black/10 border-t pt-4 sm:items-center sm:justify-between dark:border-white/10">
              <Button
                type="button"
                variant="outline"
                data-copied={isSiteInfoCopied ? 'true' : undefined}
                className="h-10 cursor-pointer rounded-xl border-black/10 bg-white/25 px-4 text-zinc-600 shadow-none hover:bg-black/5 hover:text-zinc-900 data-[copied=true]:text-theme-indicator dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                onClick={() => {
                  void handleCopySiteInfo()
                }}
                onMouseEnter={() => {
                  copyStatusIconRef.current?.startAnimation()
                }}
                onMouseLeave={() => {
                  copyStatusIconRef.current?.stopAnimation()
                }}
              >
                {isSiteInfoCopied ? (
                  <CheckIcon ref={copyStatusIconRef} className="size-4" size={16} />
                ) : (
                  <CopyIcon ref={copyStatusIconRef} className="size-4" size={16} />
                )}
                {isSiteInfoCopied ? '已复制' : '复制本站信息'}
              </Button>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 cursor-pointer rounded-xl border-black/10 bg-white/35 px-4 text-zinc-700 shadow-none hover:bg-black/5 hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                  onClick={closeModal}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 cursor-pointer rounded-xl bg-theme-indicator px-4 text-theme-active-text shadow-none hover:bg-[color-mix(in_srgb,var(--theme-indicator)_92%,black)] hover:text-theme-active-text focus-visible:ring-theme-ring/35"
                  onMouseEnter={() => {
                    sendIconRef.current?.startAnimation()
                  }}
                  onMouseLeave={() => {
                    sendIconRef.current?.stopAnimation()
                  }}
                >
                  <SendIcon ref={sendIconRef} className="size-4" />
                  {isSubmitting ? '提交中...' : '提交申请'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
