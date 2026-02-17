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
      <section className="mx-auto mt-6 flex w-full max-w-5xl flex-1 items-center justify-center rounded-3xl border border-zinc-300/80 border-dashed bg-white/25 px-5 py-12 text-zinc-600 backdrop-blur-xs dark:border-zinc-700/60 dark:bg-black/20 dark:text-zinc-400">
        虚无。
      </section>
    )
  }

  return (
    <section className="mx-auto mt-6 flex w-10/12 max-w-5xl flex-col gap-6 pb-8">
      <ul className="flex flex-col gap-6">
        {mutters.map((item, index) => {
          const createdAt = new Date(item.createdAt)
          const relativeDate = toRelativeDate(createdAt)

          return (
            <li key={item.id} className="flex items-start gap-3">
              <Image
                src={avatar}
                alt="avatar"
                className="size-11 rounded-full border border-[#00000011] object-cover shadow-xs dark:border-zinc-800"
                priority={index === 0}
              />

              <div className="flex flex-1 flex-col gap-1.5">
                <time
                  dateTime={createdAt.toISOString()}
                  title={prettyDateTime(createdAt)}
                  className="ml-1 font-medium text-xs text-zinc-500 dark:text-zinc-400"
                >
                  {relativeDate}
                </time>
                <article className="rounded-[10px] border border-white/20 bg-white/15 px-4 py-2 text-zinc-700 shadow-[0_6px_15px_0_rgba(142,142,142,0.19)] backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
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
