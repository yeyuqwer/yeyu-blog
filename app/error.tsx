'use client'

import { Button } from '@/ui/shadcn/button'

export default function AppError() {
  return (
    <section className="flex h-screen w-screen flex-col items-center justify-center gap-2 text-zinc-600 dark:text-zinc-300">
      <p className="text-3xl">(҂ ꒦ິヮ꒦ິ)</p>
      <h1 className="mt-2 font-medium text-xl">Something went wrong</h1>
      <p className="mt-2 font-medium text-xl">喵呜 ??</p>
      <Button type="button">go back</Button>
    </section>
  )
}
