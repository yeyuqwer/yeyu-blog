import { customMarkdownTheme } from '@/lib/core/markdown/markdown-style'
import { toDisplayDate } from '@/lib/utils/common/time'
import { MarkdownCodeBlockEnhancer } from '@/ui/components/shared/markdown-code-block-enhancer'
import TagItemBadge from '@/ui/components/shared/tag-item-badge'
import { ArticleImageLoadEnhancer } from './article-image-load-enhancer'
import { ArticleScrollProgress } from './article-scroll-progress'
import './media.css'
import { extractHeadings } from './utils/extract-headings'
import { extractTitleAndBody } from './utils/extract-title-and-body'

export default function ArticleDisplayPage({
  createdAt,
  tags,
  sanitizedContent,
}: {
  createdAt: Date
  sanitizedContent: string
  tags: string[]
}) {
  const headings = extractHeadings(sanitizedContent)
  const {
    body: sanitizedBody,
    titleHtml: sanitizedTitleHtml,
    titleId,
  } = extractTitleAndBody(sanitizedContent)

  return (
    <div className="z-10 min-h-dvh">
      <article className="motion-safe:animate-entry-bounce flex max-w-3xl flex-1 flex-col gap-4 rounded-sm px-6 py-2 [--site-entry-overshoot:-2px]">
        {sanitizedTitleHtml != null ? (
          <header className="flex flex-col items-center justify-center gap-3 text-center">
            <h1
              id={titleId || undefined}
              className="text-3xl leading-tight font-semibold text-balance text-zinc-950 md:text-4xl dark:text-zinc-50"
              dangerouslySetInnerHTML={{ __html: sanitizedTitleHtml }}
            />

            <section className="flex w-full flex-wrap items-center justify-center gap-2 text-xs text-zinc-600 md:text-sm dark:text-zinc-400">
              <p className="flex flex-wrap items-center justify-center gap-2 [&_span]:border-zinc-400/60 [&_span]:text-zinc-600 dark:[&_span]:border-zinc-600/70 dark:[&_span]:text-zinc-300">
                {tags.map(tag => (
                  <TagItemBadge key={tag} tag={tag} />
                ))}
              </p>

              <time className="border-b border-dashed border-zinc-400/60 font-mono text-[0.78rem] tracking-wide text-zinc-500 md:text-[0.82rem] dark:border-zinc-600/70 dark:text-zinc-400">
                {toDisplayDate(createdAt)}
              </time>
            </section>
          </header>
        ) : (
          <section className="flex w-full flex-wrap items-center justify-center gap-2 text-xs text-zinc-600 md:text-sm dark:text-zinc-400">
            <p className="flex flex-wrap items-center justify-center gap-2 [&_span]:border-zinc-400/60 [&_span]:text-zinc-600 dark:[&_span]:border-zinc-600/70 dark:[&_span]:text-zinc-300">
              {tags.map(tag => (
                <TagItemBadge key={tag} tag={tag} />
              ))}
            </p>

            <time className="border-b border-dashed border-zinc-400/60 font-mono text-[0.78rem] tracking-wide text-zinc-500 md:text-[0.82rem] dark:border-zinc-600/70 dark:text-zinc-400">
              {toDisplayDate(createdAt)}
            </time>
          </section>
        )}
        {/* 渲染的主要内容 */}
        <main
          id="article-content"
          className={customMarkdownTheme}
          dangerouslySetInnerHTML={{ __html: sanitizedBody }}
        />
        <ArticleImageLoadEnhancer rootSelector="#article-content" />
        <MarkdownCodeBlockEnhancer rootSelector="#article-content" />
        <ArticleScrollProgress
          sections={headings.map(({ id, level, text }) => ({ id, label: text, level }))}
        />
      </article>
    </div>
  )
}
