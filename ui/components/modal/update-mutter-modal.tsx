'use client'

import { toast } from 'sonner'
import { useMutterUpdateMutation } from '@/hooks/api/mutter'
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

type UpdateMutterPayload = {
  id: number
  oldContent: string
  newContent: string
  onSuccess?: () => void
}

export default function UpdateMutterModal() {
  const { modalType, payload, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'updateMutterModal'
  const values = payload != null ? (payload as UpdateMutterPayload) : null
  const { mutateAsync: updateMutterById, isPending } = useMutterUpdateMutation()

  const onSubmit = async () => {
    if (values == null) {
      toast.error('Mutter info not found.')
      return
    }

    try {
      await updateMutterById({
        id: values.id,
        content: values.newContent,
      })
      toast.success('Mutter updated.')
      values.onSuccess?.()
      onModalClose()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to update mutter.')
      }
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Confirm Update</DialogTitle>
          <DialogDescription>
            The content has changed. Confirm to update this mutter.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs">Before</p>
          <p className="line-clamp-3 whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
            {values?.oldContent}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs">After</p>
          <p className="line-clamp-3 whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
            {values?.newContent}
          </p>
        </div>

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
            className="cursor-pointer"
            onClick={() => {
              void onSubmit()
            }}
            disabled={values == null || isPending}
          >
            {isPending ? 'Updating...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
