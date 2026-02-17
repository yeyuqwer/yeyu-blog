'use client'

import Image from 'next/image'
import avatar from '@/config/img/avatar.webp'
import { usePublicMutterQuery } from '@/hooks/api/mutter'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/time'
import Loading from '@/ui/components/shared/loading'

export function MutterList() {
  const { data, isPending, isError } = usePublicMutterQuery()
  const mutters = data?.list ?? []

  if (isPending) {
    return <Loading />
  }

  if (isError) {
    throw new Error('')
  }

  if (mutters.length === 0) {
    return (
      <section className="mx-auto mt-8 flex w-full max-w-3xl flex-1 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-12 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        虚无。
      </section>
    )
  }

  return (
    <section className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-4 pb-10">
      <ul className="flex flex-col gap-4">
        {mutters.map((item, index) => {
          const createdAt = new Date(item.createdAt)
          const relativeDate = toRelativeDate(createdAt)

          return (
            <li key={item.id} className="flex items-start gap-3.5">
              <Image
                src={avatar}
                alt="avatar"
                className="size-10 rounded-full border border-zinc-200 object-cover grayscale dark:border-zinc-700"
                priority={index === 0}
              />

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <time
                  dateTime={createdAt.toISOString()}
                  title={prettyDateTime(createdAt)}
                  className="font-mono text-[11px] text-zinc-500 uppercase tracking-[0.12em] dark:text-zinc-400"
                >
                  {relativeDate}
                </time>
                <article className="rounded-xl border border-[#00000011] bg-clear-sky-background/80 px-4 py-3 text-[15px] text-zinc-900 leading-7 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                  <p className="wrap-break-word whitespace-pre-wrap">{item.content}</p>
                </article>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
