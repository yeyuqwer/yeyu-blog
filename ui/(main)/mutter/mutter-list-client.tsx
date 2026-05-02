'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import * as motion from 'motion/react-client'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import avatar from '@/config/img/avatar.webp'
import { useMutterLikeMutation } from '@/hooks/api/mutter'
import { getPublicMutters } from '@/lib/api/mutter'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/time'
import { useModalStore } from '@/store/use-modal-store'
import Loading from '@/ui/components/shared/loading'
import { itemVariants, listVariants } from './constant'
import { MutterCommentButton } from './mutter-comment-button'
import { MutterContent } from './mutter-content'
import { MutterLikeButton } from './mutter-like-button'

const pageSize = 10

export function MutterListClient({
  mutters: initialMutters,
  total,
}: {
  mutters: {
    id: number
    content: string
    likeCount: number
    createdAt: string
    commentCount: number
  }[]
  total: number
}) {
  const [likedMutterIds, setLikedMutterIds] = useState<number[]>([])
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(
    Object.fromEntries(initialMutters.map(item => [item.id, item.likeCount])),
  )
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { mutateAsync: likeMutterById } = useMutterLikeMutation()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['public-mutter-list', pageSize],
    queryFn: ({ pageParam }) => getPublicMutters({ take: pageSize, skip: pageParam }),
    initialPageParam: 0,
    initialData: {
      pages: [
        {
          list: initialMutters,
          total,
          take: pageSize,
          skip: 0,
        },
      ],
      pageParams: [0],
    },
    getNextPageParam: lastPage => {
      const nextSkip = lastPage.skip + lastPage.list.length

      return nextSkip < lastPage.total ? nextSkip : undefined
    },
    staleTime: 1000 * 30,
  })
  const modalType = useModalStore(s => s.modalType)
  const payload = useModalStore(s => s.payload)
  const setModalOpen = useModalStore(s => s.setModalOpen)
  const activeCommentPayload =
    modalType === 'mutterCommentModal' && payload != null
      ? (payload as {
          mutterId: number
          content: string
          createdAt: string
        })
      : null
  const mutters = useMemo(() => {
    const existingIds = new Set<number>()

    return data.pages
      .flatMap(page => page.list)
      .filter(item => {
        if (existingIds.has(item.id)) {
          return false
        }

        existingIds.add(item.id)

        return true
      })
  }, [data.pages])

  useEffect(() => {
    const element = loadMoreRef.current

    if (element == null || !hasNextPage) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      {
        rootMargin: '240px 0px',
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const handleLike = async (id: number) => {
    if (likedMutterIds.includes(id)) {
      return
    }

    setLikedMutterIds(previousIds => [...previousIds, id])
    setLikeCounts(previousCounts => ({
      ...previousCounts,
      [id]: (previousCounts[id] ?? 0) + 1,
    }))

    const response = await likeMutterById({
      mutterId: id,
    })

    setLikeCounts(previousCounts => ({
      ...previousCounts,
      [id]: response.data.likeCount,
    }))
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
          const isCommentActive = activeCommentPayload?.mutterId === item.id

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
                  <MutterContent content={item.content} />
                  <footer className="mt-3 flex items-center justify-end gap-0.5">
                    <MutterCommentButton
                      isActive={isCommentActive}
                      commentCount={item.commentCount}
                      onClick={() => {
                        setModalOpen('mutterCommentModal', {
                          mutterId: item.id,
                          content: item.content,
                          createdAt: item.createdAt,
                        })
                      }}
                    />

                    <MutterLikeButton
                      isLiked={isLiked}
                      likeCount={likeCount}
                      onClick={() => {
                        void handleLike(item.id)
                      }}
                    />
                  </footer>
                </article>
              </div>
            </motion.li>
          )
        })}
      </motion.ul>
      {hasNextPage ? (
        <div ref={loadMoreRef} className="flex h-28 items-center justify-center">
          {isFetchingNextPage ? <Loading /> : null}
        </div>
      ) : null}
    </motion.section>
  )
}
