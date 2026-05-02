'use client'

import Image, { type ImageLoaderProps } from 'next/image'
import { useMemo } from 'react'

const urlPattern = /https?:\/\/[^\s<>"'`]+/g
const trailingUrlTextPattern = /[),.;:!?，。！？；：、]+$/g
const passthroughImageLoader = ({ src }: ImageLoaderProps) => src

function CommentLink({
  faviconUrl,
  href,
  label,
}: {
  faviconUrl: string
  href: string
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={href}
      className="inline-flex max-w-full items-center gap-1.5 text-zinc-600 transition-colors hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      <Image
        src={faviconUrl}
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
        loader={passthroughImageLoader}
        unoptimized
      />
      <span className="min-w-0 truncate">{label}</span>
    </a>
  )
}

function getCommentContentBlocks(content: string) {
  const blocks: Array<
    | {
        kind: 'text'
        value: string
      }
    | {
        kind: 'link'
        faviconUrl: string
        href: string
        label: string
      }
  > = []
  let textStartIndex = 0

  const appendTextBlock = (text: string) => {
    const value = text.replace(/\n{3,}/g, '\n\n').trim()

    if (value.length === 0) {
      return
    }

    const previousBlock = blocks.at(-1)

    if (previousBlock?.kind === 'text') {
      previousBlock.value = `${previousBlock.value}\n${value}`
      return
    }

    blocks.push({
      kind: 'text',
      value,
    })
  }

  for (const match of content.matchAll(urlPattern)) {
    const matchedText = match[0]
    const matchIndex = match.index ?? 0
    const urlText = matchedText.replace(trailingUrlTextPattern, '')
    const nextTextStartIndex = matchIndex + urlText.length

    if (!URL.canParse(urlText)) {
      continue
    }

    const url = new URL(urlText)
    appendTextBlock(content.slice(textStartIndex, matchIndex))
    blocks.push({
      kind: 'link',
      faviconUrl: getCommentLinkFaviconUrl(url),
      href: url.toString(),
      label: getCommentLinkLabel(url),
    })
    textStartIndex = nextTextStartIndex
  }

  appendTextBlock(content.slice(textStartIndex))

  return blocks
}

function getCommentLinkFaviconUrl(url: URL) {
  return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url.origin)}&sz=64`
}

function getCommentLinkLabel(url: URL) {
  const pathname = url.pathname === '/' ? '' : url.pathname
  return `${url.hostname}${pathname}${url.search}${url.hash}`
}

export function CommentContent({ content }: { content: string }) {
  const blocks = useMemo(() => getCommentContentBlocks(content), [content])

  return (
    <div className="mt-2 flex flex-col gap-2 text-sm leading-6">
      {blocks.map((block, index) => {
        if (block.kind === 'text') {
          return (
            <p key={`text-${index}`} className="wrap-break-word whitespace-pre-wrap">
              {block.value}
            </p>
          )
        }

        if (block.kind === 'link') {
          return (
            <CommentLink
              key={`link-${block.href}-${index}`}
              faviconUrl={block.faviconUrl}
              href={block.href}
              label={block.label}
            />
          )
        }

        return null
      })}
    </div>
  )
}
