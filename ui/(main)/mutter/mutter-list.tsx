import type { Variants } from 'motion/react'
import * as motion from 'motion/react-client'
import Image from 'next/image'
import avatar from '@/config/img/avatar.webp'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/time'
import { prisma } from '@/prisma/instance'

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: [30, -8, 0] as number[],
    transition: {
      type: 'tween' as const,
      ease: 'easeInOut',
      duration: 0.8,
    },
  },
}

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export async function MutterList() {
  const mutters = await prisma.mutter.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  })

  if (mutters.length === 0) {
    return (
      <section className="mx-auto mt-8 flex w-full max-w-3xl flex-1 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-12 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        虚无。
      </section>
    )
  }

  return (
    <motion.section
      className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-4 pb-10"
      initial="hidden"
      animate="visible"
      variants={listVariants}
    >
      <motion.ul className="flex flex-col gap-4" variants={listVariants}>
        {mutters.map((item, index) => {
          const createdAt = new Date(item.createdAt)
          const relativeDate = toRelativeDate(createdAt)

          return (
            <motion.li key={item.id} className="flex items-start gap-3.5" variants={itemVariants}>
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
                <article className="rounded-xl border border-[#00000011] bg-mint-background/80 px-4 py-3 text-[15px] text-zinc-900 leading-7 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                  <p className="wrap-break-word whitespace-pre-wrap">{item.content}</p>
                </article>
              </div>
            </motion.li>
          )
        })}
      </motion.ul>
    </motion.section>
  )
}
