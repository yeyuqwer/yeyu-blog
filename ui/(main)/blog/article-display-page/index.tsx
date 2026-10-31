import { customMarkdownTheme } from '@/lib/core/markdown/markdown-style'
import { toDisplayDate } from '@/lib/utils/common/time'
import { MarkdownCodeBlockEnhancer } from '@/ui/components/shared/markdown-code-block-enhancer'
import { ArticleBlueprint } from './article-blueprint'
import { ArticleImageLoadEnhancer } from './article-image-load-enhancer'
import { ArticleScrollProgress } from './article-scroll-progress'
import './media.css'
import { extractHeadings } from './utils/extract-headings'
import { extractTitleAndBody } from './utils/extract-title-and-body'

export default function ArticleDisplayPage({
  createdAt,
  sanitizedContent,
}: {
  createdAt: Date
  sanitizedContent: string
}) {
  const headings = extractHeadings(sanitizedContent)
  const {
    body: sanitizedBody,
    titleHtml: sanitizedTitleHtml,
    titleId,
  } = extractTitleAndBody(sanitizedContent)

  return (
    <div className="z-10 min-h-dvh">
      <ArticleBlueprint>
        <article className="flex max-w-3xl flex-1 flex-col gap-4 rounded-sm px-6 py-2">
          <header className="flex flex-col items-center justify-center gap-3 text-center">
            {sanitizedTitleHtml != null && (
              <h1
                data-article-blueprint-text
                id={titleId || undefined}
                className="text-3xl leading-tight font-semibold text-balance text-zinc-950 md:text-4xl dark:text-zinc-50"
                dangerouslySetInnerHTML={{ __html: sanitizedTitleHtml }}
              />
            )}
            <time
              data-article-blueprint-text
              dateTime={createdAt.toISOString()}
              className="border-b border-dashed border-zinc-400/60 font-mono text-[0.78rem] tracking-wide text-zinc-500 md:text-[0.82rem] dark:border-zinc-600/70 dark:text-zinc-400"
            >
              {toDisplayDate(createdAt)}
            </time>
          </header>
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
      </ArticleBlueprint>
    </div>
  )
}
