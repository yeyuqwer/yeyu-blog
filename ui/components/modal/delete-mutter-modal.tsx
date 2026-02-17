'use client'

import { toast } from 'sonner'
import { useMutterDeleteMutation } from '@/hooks/api/mutter'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'

type DeleteMutterPayload = {
  id: number
  content: string
}

export default function DeleteMutterModal() {
  const { modalType, payload, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'deleteMutterModal'
  const values = payload != null ? (payload as DeleteMutterPayload) : null
  const { mutateAsync: deleteMutterById, isPending } = useMutterDeleteMutation()

  const onSubmit = async () => {
    if (values == null) {
      toast.error('Mutter info not found.')
      return
    }

    try {
      await deleteMutterById({ id: values.id })
      toast.success('Mutter deleted.')
      onModalClose()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to delete mutter.')
      }
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <p className="line-clamp-3 whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
          {values?.content}
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onModalClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="cursor-pointer"
            onClick={() => {
              void onSubmit()
            }}
            disabled={values == null || isPending}
          >
            {isPending ? 'Deleting...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
