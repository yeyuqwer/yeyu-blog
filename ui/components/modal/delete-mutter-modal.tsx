'use client'

import { sileo } from 'sileo'
import { useMutterDeleteMutation } from '@/hooks/api/mutter'
import { useModalStore } from '@/store/use-modal-store'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'

type DeleteMutterPayload = {
  id: number
  content: string
}

export default function DeleteMutterModal() {
  const { modalType, payload, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'deleteMutterModal'
  const values = payload != null ? (payload as DeleteMutterPayload) : null
  const { mutate: deleteMutterById, isPending } = useMutterDeleteMutation()

  function onSubmit() {
    if (values == null) {
      sileo.error({ title: '说说信息不存在，删除失败' })
      return
    }

    deleteMutterById(
      { id: values.id },
      {
        onSuccess: onModalClose,
      },
    )
  }

  return (
    <ConfirmDialog
      open={isModalOpen}
      onClose={onModalClose}
      onConfirm={onSubmit}
      title="确定要删除这条说说吗？"
      description="该操作不可撤销。"
      isPending={isPending}
    >
      <p className="line-clamp-3 whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
        {values?.content}
      </p>
    </ConfirmDialog>
  )
}
