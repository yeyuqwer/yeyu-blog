'use client'

import { useQuery } from '@tanstack/react-query'
import { Music2Icon, PlayIcon } from 'lucide-react'
import Image, { type ImageLoaderProps } from 'next/image'
import Script from 'next/script'
import { useCallback, useEffect, useRef } from 'react'
import { getCreateTweet } from './mutter-twitter-widget'

const passthroughImageLoader = ({ src }: ImageLoaderProps) => src

export function TwitterTweetCard({ id }: { id: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const renderTweet = useCallback(() => {
    const rootElement = rootRef.current
    const createTweet = getCreateTweet()

    if (rootElement == null || createTweet == null) {
      return
    }

    rootElement.replaceChildren()
    createTweet(id, rootElement, {
      align: 'center',
      cards: 'hidden',
      conversation: 'none',
      dnt: true,
      width: 300,
    })
  }, [id])

  useEffect(() => {
    renderTweet()
  }, [renderTweet])

  return (
    <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-xl border border-zinc-200 bg-white px-1.5 py-1.5 dark:border-zinc-800 dark:bg-zinc-950">
      <div ref={rootRef} className="[&_iframe]:!mx-auto min-h-[96px]" />
      <Script
        id="twitter-widgets-script"
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onReady={renderTweet}
      />
    </div>
  )
}

export function NeteaseMusicCard({ href, id }: { href: string; id: string }) {
  const { data: song } = useQuery({
    queryKey: ['mutter', 'neteaseMusic', id],
    queryFn: async () => {
      const response = await fetch(`/api/music/netease?id=${id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch Netease Music song.')
      }

      return (await response.json()) as {
        name: string
        artist: string
        album: string
        cover: string
      }
    },
  })

  return (
    <div className="flex overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="relative flex size-20 shrink-0 items-center justify-center bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500"
      >
        {song?.cover != null && song.cover.length > 0 ? (
          <Image
            src={song.cover}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
            loader={passthroughImageLoader}
            unoptimized
          />
        ) : (
          <Music2Icon className="size-7" />
        )}
        <span className="absolute right-2 bottom-2 flex size-6 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-sm dark:bg-zinc-800/90 dark:text-zinc-100">
          <PlayIcon className="ml-0.5 size-3 fill-current" />
        </span>
      </a>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="truncate font-medium text-[13px] text-zinc-900 leading-5 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
        >
          {song?.name ?? '网易云音乐'}
        </a>
        <p className="truncate text-[11px] text-zinc-500 leading-5 dark:text-zinc-400">
          {song?.artist != null && song.artist.length > 0
            ? `${song.artist}${song.album.length > 0 ? ` · ${song.album}` : ''}`
            : `#${id}`}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex w-fit items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[11px] text-zinc-500 leading-none transition-colors hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
        >
          <PlayIcon className="size-3 fill-current" />
          打开音乐
        </a>
      </div>
    </div>
  )
}

export function GenericLinkCard({
  faviconUrl,
  href,
  hostname,
  label,
}: {
  faviconUrl: string
  href: string
  hostname: string
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-12 items-center gap-3 overflow-hidden rounded-xl border border-zinc-200 bg-white px-3 py-2 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
    >
      <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={faviconUrl}
          alt=""
          width={16}
          height={16}
          loader={passthroughImageLoader}
          unoptimized
        />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[13px] text-zinc-800 leading-5 dark:text-zinc-100">
          {label}
        </span>
        <span className="truncate text-[11px] text-zinc-400 leading-4 dark:text-zinc-500">
          {hostname}
        </span>
      </span>
    </a>
  )
}
