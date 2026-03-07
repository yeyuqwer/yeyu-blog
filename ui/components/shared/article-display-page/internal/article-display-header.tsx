import { toDisplayDate } from '@/lib/utils/time'
import TagItemBadge from '@/ui/components/shared/tag-item-badge'

export default function ArticleDisplayHeader({
  title,
  createdAt,
  tags,
}: {
  title: string
  createdAt: Date
  tags: string[]
}) {
  return (
    <header className="flex flex-col items-center justify-center gap-3 text-center">
      {/* TODO: extract */}
      <h1 className="text-balance font-bold text-3xl text-zinc-950 leading-tight md:text-4xl dark:text-zinc-50">
        {title}
      </h1>

      <section className="flex w-full flex-wrap items-center justify-center gap-2 text-xs text-zinc-600 md:text-sm dark:text-zinc-400">
        <p className="flex flex-wrap items-center justify-center gap-2 [&_span]:border-zinc-400/60 [&_span]:text-zinc-600 dark:[&_span]:border-zinc-600/70 dark:[&_span]:text-zinc-300">
          {tags.map(tag => (
            <TagItemBadge key={`${tag.toString()}`} tag={tag} />
          ))}
        </p>

        <time className="border-zinc-400/60 border-b border-dashed font-mono text-[0.78rem] text-zinc-500 tracking-wide md:text-[0.82rem] dark:border-zinc-600/70 dark:text-zinc-400">
          {toDisplayDate(createdAt)}
        </time>
      </section>
    </header>
  )
}
