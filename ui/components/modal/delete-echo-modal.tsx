import { toast } from 'sonner'
import { useEchoDeleteMutation } from '@/hooks/api/echo'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'

export default function DeleteEchoModal() {
  const { modalType, payload, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'deleteEchoModal'
  const { id } = payload != null ? (payload as { id: number }) : {}

  const { mutateAsync: deleteEcho, isPending } = useEchoDeleteMutation()

  async function onSubmit() {
    if (id == null) {
      toast.error(`标签信息不存在，删除失败`)
      return
    }

    try {
      await deleteEcho({ id })
      toast.success(`删除成功`)
      onModalClose()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`删除失败${error.message}`)
      } else {
        toast.error(`删除失败`)
      }
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="flex flex-col items-center gap-4">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>确定要删除这个引用吗🥹</DialogTitle>
          <DialogDescription>真的会直接删除的喵🥹</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={onSubmit}
            disabled={isPending}
          >
            确定
          </Button>
          <Button variant="outline" onClick={onModalClose}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
