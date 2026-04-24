'use client'

import { sileo } from 'sileo'
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
  const modalType = useModalStore(s => s.modalType)
  const payload = useModalStore(s => s.payload)
  const closeModal = useModalStore(s => s.closeModal)
  const isModalOpen = modalType === 'updateMutterModal'
  const values = payload != null ? (payload as UpdateMutterPayload) : null
  const { mutate: updateMutterById, isPending } = useMutterUpdateMutation()

  const onSubmit = () => {
    if (values == null) {
      sileo.error({ title: 'Mutter info not found.' })
      return
    }

    updateMutterById(
      {
        id: values.id,
        content: values.newContent,
      },
      {
        onSuccess: () => {
          sileo.success({ title: 'Mutter updated.' })
          values.onSuccess?.()
          closeModal()
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
      },
    )
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
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
            onClick={closeModal}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="cursor-pointer"
            onClick={onSubmit}
            disabled={values == null || isPending}
          >
            {isPending ? 'Updating...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
