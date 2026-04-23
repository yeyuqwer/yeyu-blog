import { TagType } from '@prisma/client'
import { sileo } from 'sileo'
import { useBlogDeleteMutation } from '@/hooks/api/blog'
import { useNoteDeleteMutation } from '@/hooks/api/note'
import { useModalStore } from '@/store/use-modal-store'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'

export default function DeleteArticleModal() {
  const modalType = useModalStore(s => s.modalType)
  const payload = useModalStore(s => s.payload)
  const onModalClose = useModalStore(s => s.onModalClose)

  const isModalOpen = modalType === 'deleteArticleModal'
  const { id, title, articleType } =
    payload != null
      ? (payload as {
          id: number
          title: string
          articleType: TagType
        })
      : {}

  const { mutate: deleteBlogById, isPending: isDeletingBlog } = useBlogDeleteMutation()
  const { mutate: deleteNoteById, isPending: isDeletingNote } = useNoteDeleteMutation()
  const isPending = isDeletingBlog || isDeletingNote

  function onSubmit() {
    if (id == null || articleType == null || title == null) {
      sileo.error({ title: '文章信息不存在，删除失败' })
      return
    }

    const onSuccess = () => {
      sileo.success({ title: `删除文章「${title}」成功` })
      onModalClose()
    }

    const onError = (error: unknown) => {
      if (error instanceof Error) {
        sileo.error({ title: `删除文章「${title}」失败：${error.message}` })
      } else {
        sileo.error({ title: `删除文章「${title}」失败` })
      }
    }

    switch (articleType) {
      case TagType.BLOG:
        deleteBlogById({ id }, { onSuccess, onError })
        break
      case TagType.NOTE:
        deleteNoteById({ id }, { onSuccess, onError })
        break
      default:
        sileo.error({ title: '删除文章类型不匹配' })
    }
  }

  return (
    <ConfirmDialog
      open={isModalOpen}
      onClose={onModalClose}
      onConfirm={onSubmit}
      title="确定要删除这篇文章吗🥹"
      description="真的会直接删除的喵🥹"
      isPending={isPending}
    />
  )
}
