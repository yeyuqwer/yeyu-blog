'use client'

import type { Variants } from 'motion/react'
import { Heart, MessageCircle } from 'lucide-react'
import * as motion from 'motion/react-client'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import avatar from '@/config/img/avatar.webp'
import { likeMutter } from '@/lib/api/mutter'
import { cn } from '@/lib/utils/common/shadcn'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/time'
import { useModalStore } from '@/store/use-modal-store'

type MutterItem = {
  id: number
  content: string
  likeCount: number
  createdAt: string
  updatedAt: string
  commentCount: number
}

type MutterListClientProps = {
  mutters: MutterItem[]
}

type MutterCommentModalPayload = {
  mutterId: number
  content: string
  createdAt: string
}

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

export function MutterListClient({ mutters }: MutterListClientProps) {
  const [likedMutterIds, setLikedMutterIds] = useState<number[]>([])
  const [likingMutterIds, setLikingMutterIds] = useState<number[]>([])
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(
    Object.fromEntries(mutters.map(item => [item.id, item.likeCount])),
  )
  const { modalType, payload, setModalOpen } = useModalStore()
  const activeCommentPayload =
    modalType === 'mutterCommentModal' && payload != null
      ? (payload as MutterCommentModalPayload)
      : null

  const handleLike = async (id: number) => {
    const previousLikeCount =
      likeCounts[id] ?? mutters.find(mutter => mutter.id === id)?.likeCount ?? 0
    const wasLiked = likedMutterIds.includes(id)

    setLikingMutterIds(previousIds =>
      previousIds.includes(id) ? previousIds : [...previousIds, id],
    )
    setLikedMutterIds(previousIds =>
      previousIds.includes(id) ? previousIds : [...previousIds, id],
    )
    setLikeCounts(previousCounts => ({
      ...previousCounts,
      [id]: (previousCounts[id] ?? previousLikeCount) + 1,
    }))

    try {
      const response = await likeMutter({
        mutterId: id,
      })

      setLikeCounts(previousCounts => ({
        ...previousCounts,
        [id]: response.data.likeCount,
      }))
    } catch (error) {
      setLikeCounts(previousCounts => ({
        ...previousCounts,
        [id]: previousLikeCount,
      }))
      if (!wasLiked) {
        setLikedMutterIds(previousIds => previousIds.filter(currentId => currentId !== id))
      }
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to like mutter.')
      }
    } finally {
      setLikingMutterIds(previousIds => previousIds.filter(currentId => currentId !== id))
    }
  }

  const handleOpenCommentModal = (id: number) => {
    const targetMutter = mutters.find(item => item.id === id)
    if (targetMutter == null) {
      return
    }

    setModalOpen('mutterCommentModal', {
      mutterId: targetMutter.id,
      content: targetMutter.content,
      createdAt: targetMutter.createdAt,
    } satisfies MutterCommentModalPayload)
  }

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
          const isLiked = likedMutterIds.includes(item.id)
          const likeCount = likeCounts[item.id] ?? item.likeCount
          const showLikeCount = likeCount > 0
          const isCommentActive = activeCommentPayload?.mutterId === item.id
          const showCommentCount = item.commentCount > 0

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
                <article className="rounded-xl border border-[#00000011] bg-theme-background/80 px-4 py-3 text-[15px] text-zinc-900 leading-7 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                  <p className="wrap-break-word whitespace-pre-wrap">{item.content}</p>
                  <footer className="mt-3 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      aria-label="open comment modal"
                      aria-pressed={isCommentActive}
                      className={cn(
                        'inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md px-2 text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-zinc-500 dark:hover:text-zinc-200',
                        isCommentActive && 'text-zinc-700 dark:text-zinc-200',
                      )}
                      onClick={() => {
                        handleOpenCommentModal(item.id)
                      }}
                    >
                      <MessageCircle className="size-4" />
                      {showCommentCount ? (
                        <span className="font-medium text-[11px] leading-none">
                          {item.commentCount}
                        </span>
                      ) : null}
                    </button>

                    <button
                      type="button"
                      aria-label="like mutter"
                      aria-pressed={isLiked}
                      className={cn(
                        'inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md px-2 text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-zinc-500 dark:hover:text-zinc-200',
                        isLiked && 'text-rose-500 hover:text-rose-500 dark:text-rose-500',
                      )}
                      disabled={likingMutterIds.includes(item.id)}
                      onClick={() => {
                        void handleLike(item.id)
                      }}
                    >
                      <Heart
                        className={cn(
                          'size-4 transition-colors',
                          isLiked && 'fill-rose-500 text-rose-500',
                        )}
                      />
                      {showLikeCount ? (
                        <span className="font-medium text-[11px] leading-none">{likeCount}</span>
                      ) : null}
                    </button>
                  </footer>
                </article>
              </div>
            </motion.li>
          )
        })}
      </motion.ul>
    </motion.section>
  )
}
