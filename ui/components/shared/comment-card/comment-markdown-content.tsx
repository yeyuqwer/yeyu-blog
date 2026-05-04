import Image, { type ImageLoaderProps } from 'next/image'
import { useMemo } from 'react'
import { cn } from '@/lib/utils/common/shadcn'

const urlPattern = /https?:\/\/[^\s<>"'`]+/g
const sentencePunctuationPattern = /[，。！？；：、]/
const trailingUrlTextPattern = /[),.;:!?，。！？；：、]+$/g
const passthroughImageLoader = ({ src }: ImageLoaderProps) => src

function CommentMarkdownText({ html }: { html: string }) {
  return (
    <div
      className={cn(
        'markdown-content prose prose-sm prose-zinc dark:prose-invert max-w-none text-[15px] text-zinc-900 leading-7 dark:text-zinc-100',
        'prose-headings:mt-4 prose-headings:mb-2 prose-headings:text-left prose-headings:tracking-tight',
        'prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-sm prose-h5:text-sm prose-h6:text-sm',
        'prose-p:my-0 prose-p:break-words [&_p+p]:mt-3 [&_p:last-child]:mb-0',
        'prose-a:break-all prose-a:border-current prose-a:border-b prose-a:text-[#0f766e] prose-a:no-underline prose-a:duration-200 prose-a:hover:text-[#0d9488]',
        'prose-li:my-1 prose-ol:my-3 prose-ul:my-3',
        'prose-blockquote:my-3 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:font-normal',
        'prose-img:my-3 prose-pre:my-4 prose-pre:overflow-x-auto prose-img:rounded-md prose-pre:rounded-md',
        'dark:prose-a:text-[#f596aa] dark:prose-a:hover:text-[#f9a8d4]',
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

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
      className="inline-flex w-fit max-w-full items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
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

function getUrlText(matchedText: string) {
  const punctuationIndex = matchedText.search(sentencePunctuationPattern)
  const trimmedText = punctuationIndex === -1 ? matchedText : matchedText.slice(0, punctuationIndex)

  return trimmedText.replace(trailingUrlTextPattern, '')
}

function shouldKeepUrlInMarkdown(content: string, startIndex: number, endIndex: number) {
  return (
    isMarkdownLinkUrl(content, startIndex) ||
    isMarkdownAutolink(content, startIndex, endIndex) ||
    isInsideInlineCode(content, startIndex)
  )
}

function isMarkdownLinkUrl(content: string, startIndex: number) {
  if (content[startIndex - 1] !== '(' || content[startIndex - 2] !== ']') {
    return false
  }

  const labelStartIndex = content.lastIndexOf('[', startIndex - 2)
  const lineStartIndex = content.lastIndexOf('\n', startIndex - 2)

  return labelStartIndex > lineStartIndex
}

function isMarkdownAutolink(content: string, startIndex: number, endIndex: number) {
  return content[startIndex - 1] === '<' && content[endIndex] === '>'
}

function isInsideInlineCode(content: string, startIndex: number) {
  const lineStartIndex = content.lastIndexOf('\n', startIndex - 1) + 1
  const textBeforeUrl = content.slice(lineStartIndex, startIndex)
  const backtickCount = textBeforeUrl.match(/`/g)?.length ?? 0

  return backtickCount % 2 === 1
}

function getCommentLinkFaviconUrl(url: URL) {
  return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url.origin)}&sz=64`
}

function getCommentLinkLabel(url: URL) {
  const pathname = url.pathname === '/' ? '' : url.pathname
  return `${url.hostname}${pathname}${url.search}${url.hash}`
}

function getCommentLinkBlocks(content: string) {
  const links: Array<{
    faviconUrl: string
    href: string
    label: string
  }> = []

  for (const match of content.matchAll(urlPattern)) {
    const matchedText = match[0]
    const matchIndex = match.index ?? 0
    const urlText = getUrlText(matchedText)
    const nextTextStartIndex = matchIndex + urlText.length

    if (
      !URL.canParse(urlText) ||
      shouldKeepUrlInMarkdown(content, matchIndex, nextTextStartIndex)
    ) {
      continue
    }

    const url = new URL(urlText)
    links.push({
      faviconUrl: getCommentLinkFaviconUrl(url),
      href: url.toString(),
      label: getCommentLinkLabel(url),
    })
  }

  return links
}

export function CommentMarkdownContent({
  content,
  htmlContent,
}: {
  content: string
  htmlContent: string
}) {
  const links = useMemo(() => getCommentLinkBlocks(content), [content])

  return (
    <div className="flex flex-col gap-2">
      <CommentMarkdownText html={htmlContent} />
      {links.map(link => (
        <CommentLink
          key={link.href}
          faviconUrl={link.faviconUrl}
          href={link.href}
          label={link.label}
        />
      ))}
    </div>
  )
}
