'use client'

import { useMemo } from 'react'
import { GenericLinkCard, NeteaseMusicCard, TwitterTweetCard } from './mutter-content-cards'
import { getMutterContentBlocks } from './mutter-content-utils'

export function MutterContent({ content }: { content: string }) {
  const blocks = useMemo(() => getMutterContentBlocks(content), [content])

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) => {
        if (block.kind === 'text') {
          return (
            <p key={`text-${index}`} className="wrap-break-word whitespace-pre-wrap">
              {block.value}
            </p>
          )
        }

        if (block.kind === 'twitter') {
          return <TwitterTweetCard key={`twitter-${block.id}-${index}`} id={block.id} />
        }

        if (block.kind === 'neteaseMusic') {
          return (
            <NeteaseMusicCard
              key={`netease-music-${block.id}-${index}`}
              href={block.href}
              id={block.id}
            />
          )
        }

        return (
          <GenericLinkCard
            key={`link-${block.hostname}-${index}`}
            faviconUrl={block.faviconUrl}
            href={block.href}
            hostname={block.hostname}
            label={block.label}
          />
        )
      })}
    </div>
  )
}
