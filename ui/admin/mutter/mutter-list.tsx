'use client'

import { Edit2, Eye, EyeOff, Trash } from 'lucide-react'
import { type ComponentProps, type FC, useState } from 'react'
import { toast } from 'sonner'
import { useMutterPublishMutation, useMutterQuery } from '@/hooks/api/mutter'
import { prettyDateTime } from '@/lib/utils/time'
import Loading from '@/ui/components/shared/loading'
import { Button } from '@/ui/shadcn/button'

export const MutterList: FC<
  ComponentProps<'main'> & {
    query: string
  }
> = ({ query }) => {
  const { data, isPending } = useMutterQuery({ q: query })
  const { mutateAsync: toggleMutterPublish } = useMutterPublishMutation()
  const [togglingMutterIds, setTogglingMutterIds] = useState<number[]>([])
  const mutters = data?.list ?? []

  const handleTogglePublish = async (id: number, isPublished: boolean) => {
    setTogglingMutterIds(previousIds =>
      previousIds.includes(id) ? previousIds : [...previousIds, id],
    )

    try {
      await toggleMutterPublish({
        id,
        isPublished,
      })
      toast.success(isPublished ? 'Mutter is now visible.' : 'Mutter is now hidden.')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to update mutter publish status.')
      }
    } finally {
      setTogglingMutterIds(previousIds => previousIds.filter(currentId => currentId !== id))
    }
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
            return (
              <li key={item.id} className="relative rounded-sm border bg-background p-2 shadow-xs">
                <section className="absolute top-1.5 right-1.5 flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    className="cursor-pointer"
                    aria-label="edit mutter"
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
                      void handleTogglePublish(item.id, !item.isPublished)
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
                  {prettyDateTime(new Date(item.createdAt))}
                </time>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
