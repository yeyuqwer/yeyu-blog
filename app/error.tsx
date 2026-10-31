'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/ui/shadcn/button'

export default function AppError() {
  const { back } = useRouter()

  return (
    <section className="flex h-dvh w-screen flex-col items-center justify-center gap-2 text-zinc-600 dark:text-zinc-300">
      <p className="text-3xl">(҂ ꒦ິヮ꒦ິ)</p>
      <h1 className="mt-2 text-xl font-medium">Something went wrong</h1>
      <p className="mt-2 text-xl font-medium">喵呜 ??</p>
      <Button type="button" onClick={back}>
        go back
      </Button>
    </section>
  )
}
