import type { ComponentProps, FC } from 'react'

export type MutterListItem = {
  id: number
  content: string
  createdAt: string
}

export const MutterList: FC<
  ComponentProps<'main'> & {
    data?: MutterListItem[]
  }
> = ({ data = [] }) => {
  return (
    <main className="max-h-[69vh] min-h-0 flex-1 overflow-y-auto rounded-md border bg-card p-3">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center rounded-md border border-dashed text-muted-foreground text-sm">
          暂无 mutter 数据
        </div>
      ) : (
        <ul className="space-y-2">
          {data.map(item => {
            return (
              <li key={item.id} className="rounded-md border bg-background p-3 shadow-xs">
                <p className="whitespace-pre-wrap text-sm leading-6">{item.content}</p>
                <time className="mt-2 block text-muted-foreground text-xs">{item.createdAt}</time>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
