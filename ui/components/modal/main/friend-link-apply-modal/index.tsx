'use client'

import type { SyntheticEvent } from 'react'
import type { CreateFriendLinkParams } from '@/lib/api/friend-link/create-friend-link'
import { LoaderCircle, Send } from 'lucide-react'
import { LayoutGroup } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useFriendLinkMutation } from '@/hooks/api/friend-link/use-friend-link-mutation'
import { useModalActions, useModalType } from '@/store/use-modal-store'
import { Modal } from '@/ui/components/interior/modal'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import ReactQueryProvider from '@/ui/components/provider/react-query-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
import { copyToClipboard } from '@/ui/shadcn/copy-button'
import { ModalActionButton, ModalActionLabel } from '../modal-action-button'
import { friendLinkApplyFields } from './constant'
import { FriendLinkFormField } from './form-field'

const FriendLinkApplyModalContent = () => {
  const modalType = useModalType()
  const { closeModal } = useModalActions()
  const isModalOpen = modalType === 'friendLinkApplyModal'
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
    if (isSubmitting) return

    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.querySelector<HTMLInputElement>('input:invalid')?.focus()
      return
    }

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
      title={<LanguageText>{translations.friendLinkApplyModal.title}</LanguageText>}
      description={
        <>
          {translations.friendLinkApplyModal.description.map((description, index) => (
            <span key={index} className="block">
              <LanguageText delay={index * 30}>{description}</LanguageText>
            </span>
          ))}
        </>
      }
      footer={
        <div className="flex w-full flex-col-reverse gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <ModalActionButton
            type="button"
            variant="outline"
            data-copied={isCopied ? 'true' : undefined}
            className="group/copy h-9 cursor-pointer rounded-lg border-black/10 bg-black/[0.03] px-3 text-zinc-700 shadow-none hover:border-black/20 hover:bg-black/[0.06] hover:text-black dark:border-white/12 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:border-white/25 dark:hover:bg-white/[0.12] dark:hover:text-white"
            onClick={() => {
              void handleCopySiteInfo()
            }}
          >
            <svg
              aria-hidden
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g className="transition-opacity delay-100 duration-150 group-data-[copied=true]/copy:opacity-0 motion-reduce:transition-none">
                <rect x="8" y="8" width="13" height="13" rx="2" />
                <path
                  d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"
                  className="transition-transform duration-200 group-data-[copied=true]/copy:translate-x-1.5 group-data-[copied=true]/copy:translate-y-1.5 motion-reduce:transition-none"
                />
              </g>
              <path
                d="m5 12 4 4L19 6"
                pathLength={1}
                strokeDasharray={1}
                className="transition-[stroke-dashoffset] duration-200 [stroke-dashoffset:1] group-data-[copied=true]/copy:delay-200 group-data-[copied=true]/copy:[stroke-dashoffset:0] motion-reduce:transition-none"
              />
            </svg>
            <ModalActionLabel
              label={translations.friendLinkApplyModal.copySiteInfo}
              activeLabel={translations.friendLinkApplyModal.copied}
              active={isCopied}
            />
          </ModalActionButton>

          <div className="flex flex-col-reverse gap-1.5 sm:flex-row">
            <ModalActionButton
              type="button"
              variant="outline"
              className="h-9 cursor-pointer rounded-lg border-black/10 bg-black/[0.03] px-3 text-zinc-700 shadow-none hover:border-black/20 hover:bg-black/[0.06] hover:text-black dark:border-white/12 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:border-white/25 dark:hover:bg-white/[0.12] dark:hover:text-white"
              onClick={closeModal}
            >
              <LanguageText>{translations.friendLinkApplyModal.cancel}</LanguageText>
            </ModalActionButton>
            <ModalActionButton
              type="submit"
              form="friend-link-apply-form"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="h-9 cursor-pointer rounded-lg bg-black px-3 text-white shadow-none hover:bg-zinc-800 hover:text-white focus-visible:border-black focus-visible:ring-black/25 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:hover:text-black dark:focus-visible:border-white dark:focus-visible:ring-white/35"
            >
              {isSubmitting ? (
                <LoaderCircle aria-hidden className="size-4 motion-safe:animate-spin" />
              ) : (
                <Send aria-hidden className="size-4" />
              )}
              <ModalActionLabel
                label={translations.friendLinkApplyModal.submit}
                activeLabel={translations.friendLinkApplyModal.submitting}
                active={isSubmitting}
              />
            </ModalActionButton>
          </div>
        </div>
      }
      closeLabel={translations.friendLinkApplyModal.closeLabel}
      layoutChildren
      initialFocusRef={firstFieldRef}
      maxWidth={500}
      maxHeight="88vh"
      className="border-black/10 bg-white/90 text-zinc-800 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90 dark:text-zinc-100 dark:shadow-[0_20px_48px_rgba(0,0,0,0.38)]"
      titleClassName="text-center font-semibold text-lg text-zinc-900 tracking-tight dark:text-white"
      descriptionClassName="text-center text-[11px] text-zinc-500 leading-5 dark:text-zinc-400"
      bodyClassName="[scrollbar-color:rgba(113,113,122,0.45)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-0.75"
      footerClassName="border-black/10 dark:border-white/10"
    >
      <form
        id="friend-link-apply-form"
        noValidate
        aria-busy={isSubmitting}
        className="grid gap-4 pt-2"
        onSubmit={handleSubmit}
      >
        <LayoutGroup>
          {friendLinkApplyFields.map((field, index) => (
            <FriendLinkFormField
              key={field.name}
              field={field}
              index={index}
              inputRef={index === 0 ? firstFieldRef : undefined}
            />
          ))}
        </LayoutGroup>
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
