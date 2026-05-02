import { MessageCircle } from 'lucide-react'

export function CommentCardHeader({ total }: { total?: number }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3 border-zinc-200/70 border-b pb-4 dark:border-zinc-800/70">
      <div>
        <div className="flex items-center gap-2">
          <MessageCircle className="size-4 text-zinc-500 dark:text-zinc-400" />
          <h2 className="font-medium text-lg text-zinc-900 dark:text-zinc-100">评论</h2>
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {total != null && total > 0 ? `共 ${total} 条评论` : '还没有评论，来发表第一条评论吧'}
        </p>
      </div>
    </header>
  )
}
