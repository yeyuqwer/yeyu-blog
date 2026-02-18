'use client'

import { usePublicEchoQuery } from '@/hooks/api/echo'

export default function EchoCard() {
  const { data } = usePublicEchoQuery()
  const echo = data

  return (
    <section className="mt-4 flex w-2/3 flex-col">
      <p
        suppressHydrationWarning
        className="underline drop-shadow-[0_0_0.75rem_#1babbb] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      >
        {echo?.content ?? '虚无。'}
      </p>
      <footer
        suppressHydrationWarning
        className="ml-auto font-thin text-pink-600 text-sm drop-shadow-[0_0_0.75rem_#1babbb] dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      >
        「{echo?.reference ?? '无名。'}」
      </footer>
    </section>
  )
}
