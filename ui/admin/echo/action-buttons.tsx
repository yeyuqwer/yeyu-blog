import { Edit2, Trash } from 'lucide-react'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'

export default function ActionButtons({
  id,
  content,
  isPublished,
  reference,
}: {
  id: number
  content: string
  isPublished: boolean
  reference: string
}) {
  const setModalOpen = useModalStore(s => s.setModalOpen)

  return (
    <section className="flex items-center gap-1">
      <Button
        variant="outline"
        className="size-8 cursor-pointer"
        onClick={() => {
          setModalOpen('editEchoModal', {
            id,
            content,
            isPublished,
            reference,
          })
        }}
      >
        <Edit2 className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="size-8 cursor-pointer text-red-600"
        onClick={() => {
          setModalOpen('deleteEchoModal', {
            id,
          })
        }}
      >
        <Trash />
      </Button>
    </section>
  )
}
