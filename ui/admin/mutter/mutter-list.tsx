'use client'

import { Edit2, Eye, EyeOff, Trash } from 'lucide-react'
import { type ComponentProps, type FC, useState } from 'react'
import { sileo } from 'sileo'
import { useMutterPublishMutation, useMutterQuery } from '@/hooks/api/mutter'
import { prettyDateTime } from '@/lib/utils/time'
import { useModalStore } from '@/store/use-modal-store'
import Loading from '@/ui/components/shared/loading'
import { Button } from '@/ui/shadcn/button'

export const MutterList: FC<
  ComponentProps<'main'> & {
    query: string
    onEditMutter: (values: { id: number; content: string }) => void
  }
> = ({ query, onEditMutter }) => {
  const { data, isPending } = useMutterQuery({ q: query })
  const setModalOpen = useModalStore(s => s.setModalOpen)
  const { mutate: toggleMutterPublish } = useMutterPublishMutation()
  const [togglingMutterIds, setTogglingMutterIds] = useState<number[]>([])
  const mutters = data?.list ?? []

  const handleTogglePublish = (id: number, isPublished: boolean) => {
    setTogglingMutterIds(previousIds =>
      previousIds.includes(id) ? previousIds : [...previousIds, id],
    )

    toggleMutterPublish(
      {
        id,
        isPublished,
      },
      {
        onSuccess: () => {
          sileo.success({
            title: isPublished ? 'Mutter is now visible.' : 'Mutter is now hidden.',
          })
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
        onSettled: () => {
          setTogglingMutterIds(previousIds => previousIds.filter(currentId => currentId !== id))
        },
      },
    )
  }

  if (isPending) {
    return <Loading />
  }

  return (
    <main className="flex max-h-[69vh] min-h-0 flex-1 overflow-y-auto bg-card [scrollbar-color:rgba(113,113,122,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[3px]">
      {mutters.length === 0 ? (
        <div className="m-auto">虚无。</div>
      ) : (
        <ul className="w-full space-y-2">
          {mutters.map(item => {
            const createdAt = new Date(item.createdAt)
            const updatedAt = new Date(item.updatedAt)
            const isEdited = updatedAt.getTime() > createdAt.getTime()
            const displayAt = isEdited ? updatedAt : createdAt

            return (
              <li key={item.id} className="relative rounded-sm border bg-background p-2 shadow-xs">
                <section className="absolute top-1.5 right-1.5 flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    className="cursor-pointer"
                    aria-label="edit mutter"
                    onClick={() => {
                      onEditMutter({
                        id: item.id,
                        content: item.content,
                      })
                    }}
                  >
                    <Edit2 className="size-3" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    className="cursor-pointer"
                    aria-label={item.isPublished ? 'hide mutter' : 'show mutter'}
                    disabled={togglingMutterIds.includes(item.id)}
                    onClick={() => {
                      handleTogglePublish(item.id, !item.isPublished)
                    }}
                  >
                    {item.isPublished ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    className="cursor-pointer text-red-600"
                    aria-label="delete mutter"
                    onClick={() => {
                      setModalOpen('deleteMutterModal', {
                        id: item.id,
                        content: item.content,
                      })
                    }}
                  >
                    <Trash className="size-3" />
                  </Button>
                </section>

                <p
                  className={`whitespace-pre-wrap pr-22 text-sm leading-6 ${
                    item.isPublished ? '' : 'text-muted-foreground line-through'
                  }`}
                >
                  {item.content}
                </p>
                <time className="mt-2 block text-right text-muted-foreground text-xs">
                  {prettyDateTime(displayAt)}
                  {isEdited ? <span className="ml-1">(#已编辑)</span> : null}
                </time>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
