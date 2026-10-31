'use client'

import type { SyntheticEvent } from 'react'
import type { CreateFriendLinkParams } from '@/lib/api/friend-link/create-friend-link'
import { useEffect, useRef, useState } from 'react'
import { useFriendLinkMutation } from '@/hooks/api/friend-link/use-friend-link-mutation'
import { useModalActions, useModalType } from '@/store/use-modal-store'
import { Modal } from '@/ui/components/interior/modal'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import ReactQueryProvider from '@/ui/components/provider/react-query-provider'
import { Button } from '@/ui/shadcn/button'
import { CheckIcon } from '@/ui/shadcn/check'
import { CopyIcon } from '@/ui/shadcn/copy'
import { copyToClipboard } from '@/ui/shadcn/copy-button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { SendIcon, type SendIconHandle } from '@/ui/shadcn/send'
import { friendLinkApplyFields } from './constant'

const FriendLinkApplyModalContent = () => {
  const modalType = useModalType()
  const { closeModal } = useModalActions()
  const isModalOpen = modalType === 'friendLinkApplyModal'
  const sendIconRef = useRef<SendIconHandle>(null)
  const copyStatusIconRef = useRef<SendIconHandle>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const [copyFeedbackVersion, setCopyFeedbackVersion] = useState(0)
  const isCopied = copyFeedbackVersion > 0
  const translations = useTranslations()
  const { mutate: createFriendLink, isPending: isSubmitting } = useFriendLinkMutation()

  useEffect(() => {
    if (copyFeedbackVersion === 0) return

    const copyResetTimerId = window.setTimeout(() => {
      setCopyFeedbackVersion(0)
    }, 2000)

    return () => {
      window.clearTimeout(copyResetTimerId)
    }
  }, [copyFeedbackVersion])

  const handleCopySiteInfo = async () => {
    const siteInfo = friendLinkApplyFields
      .map(field => {
        const fieldTranslations = translations.friendLinkApplyModal.fields[field.name]

        return `${fieldTranslations.label}: ${fieldTranslations.placeholder}`
      })
      .join('\n')

    await copyToClipboard(siteInfo)

    setCopyFeedbackVersion(currentCopyFeedbackVersion => currentCopyFeedbackVersion + 1)
  }

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = friendLinkApplyFields.reduce((result, field) => {
      result[field.name] = String(formData.get(field.name) ?? '')
      return result
    }, {} as CreateFriendLinkParams)

    createFriendLink(payload, {
      onSuccess: () => {
        form.reset()
        closeModal()
      },
    })
  }

  return (
    <Modal
      open={isModalOpen}
      onClose={closeModal}
      title={translations.friendLinkApplyModal.title}
      description={
        <>
          {translations.friendLinkApplyModal.description.map(description => (
            <span key={description} className="block">
              {description}
            </span>
          ))}
        </>
      }
      footer={
        <div className="flex w-full flex-col-reverse gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            data-copied={isCopied ? 'true' : undefined}
            className="h-9 cursor-pointer rounded-lg border-black/10 bg-black/[0.03] px-3 text-zinc-700 shadow-none hover:border-black/20 hover:bg-black/[0.06] hover:text-black data-[copied=true]:border-black/25 data-[copied=true]:bg-black/[0.08] data-[copied=true]:text-black dark:border-white/12 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:border-white/25 dark:hover:bg-white/[0.12] dark:hover:text-white dark:data-[copied=true]:border-white/30 dark:data-[copied=true]:bg-white/[0.15] dark:data-[copied=true]:text-white"
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
            {isCopied ? (
              <CheckIcon ref={copyStatusIconRef} className="size-4" size={16} />
            ) : (
              <CopyIcon ref={copyStatusIconRef} className="size-4" size={16} />
            )}
            {isCopied
              ? translations.friendLinkApplyModal.copied
              : translations.friendLinkApplyModal.copySiteInfo}
          </Button>

          <div className="flex flex-col-reverse gap-1.5 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-9 cursor-pointer rounded-lg border-black/10 bg-black/[0.03] px-3 text-zinc-700 shadow-none hover:border-black/20 hover:bg-black/[0.06] hover:text-black dark:border-white/12 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:border-white/25 dark:hover:bg-white/[0.12] dark:hover:text-white"
              onClick={closeModal}
            >
              {translations.friendLinkApplyModal.cancel}
            </Button>
            <Button
              type="submit"
              form="friend-link-apply-form"
              disabled={isSubmitting}
              className="h-9 cursor-pointer rounded-lg bg-black px-3 text-white shadow-none hover:bg-zinc-800 hover:text-white focus-visible:border-black focus-visible:ring-black/25 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:hover:text-black dark:focus-visible:border-white dark:focus-visible:ring-white/35"
              onMouseEnter={() => {
                sendIconRef.current?.startAnimation()
              }}
              onMouseLeave={() => {
                sendIconRef.current?.stopAnimation()
              }}
            >
              <SendIcon ref={sendIconRef} className="size-4" />
              {isSubmitting
                ? translations.friendLinkApplyModal.submitting
                : translations.friendLinkApplyModal.submit}
            </Button>
          </div>
        </div>
      }
      closeLabel={translations.friendLinkApplyModal.closeLabel}
      initialFocusRef={firstFieldRef}
      maxWidth={500}
      maxHeight="88vh"
      className="border-black/10 bg-white/90 text-zinc-800 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90 dark:text-zinc-100 dark:shadow-[0_20px_48px_rgba(0,0,0,0.38)]"
      titleClassName="text-center font-semibold text-lg text-zinc-900 tracking-tight dark:text-white"
      descriptionClassName="text-center text-[11px] text-zinc-500 leading-5 dark:text-zinc-400"
      bodyClassName="[scrollbar-color:rgba(113,113,122,0.45)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-0.75"
      footerClassName="border-black/10 dark:border-white/10"
    >
      <form id="friend-link-apply-form" className="grid gap-3" onSubmit={handleSubmit}>
        {friendLinkApplyFields.map((field, index) => {
          const fieldId = `friend-link-apply-${field.name}`
          const fieldTranslations = translations.friendLinkApplyModal.fields[field.name]

          return (
            <div key={field.name} className="grid gap-1.5">
              <Label
                htmlFor={fieldId}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                {fieldTranslations.label}
              </Label>
              <Input
                ref={index === 0 ? firstFieldRef : undefined}
                id={fieldId}
                name={field.name}
                type={field.type}
                required={field.required}
                placeholder={fieldTranslations.placeholder}
                className="h-9 rounded-lg border-black/10 bg-black/[0.03] text-sm shadow-none placeholder:text-zinc-400 focus-visible:border-black/30 focus-visible:ring-black/20 dark:border-white/12 dark:bg-white/[0.06] dark:placeholder:text-zinc-500 dark:focus-visible:border-white/30 dark:focus-visible:ring-white/35"
              />
            </div>
          )
        })}
      </form>
    </Modal>
  )
}

export const FriendLinkApplyModal = () => {
  return (
    <ReactQueryProvider>
      <FriendLinkApplyModalContent />
    </ReactQueryProvider>
  )
}
