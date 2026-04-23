import { sileo } from 'sileo'
import { useEchoDeleteMutation } from '@/hooks/api/echo'
import { useModalStore } from '@/store/use-modal-store'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'

export default function DeleteEchoModal() {
  const modalType = useModalStore(s => s.modalType)
  const payload = useModalStore(s => s.payload)
  const onModalClose = useModalStore(s => s.onModalClose)
  const isModalOpen = modalType === 'deleteEchoModal'
  const { id } = payload != null ? (payload as { id: number }) : {}

  const { mutate: deleteEcho, isPending } = useEchoDeleteMutation()

  function onSubmit() {
    if (id == null) {
      sileo.error({ title: '引用信息不存在，删除失败' })
      return
    }

    deleteEcho(
      { id },
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
      title="确定要删除这个引用吗🥹"
      description="真的会直接删除的喵🥹"
      isPending={isPending}
    />
  )
}
