import * as motion from 'motion/react-client'
import { customMarkdownTheme } from '@/lib/core/markdown'
import { toDisplayDate } from '@/lib/utils/time'
import { MarkdownCodeBlockEnhancer } from '@/ui/components/shared/markdown-code-block-enhancer'
import TagItemBadge from '@/ui/components/shared/tag-item-badge'
import { PostToc } from './post-toc'
import { extractHeadings, extractTitleAndBody } from './utils'

export default function ArticleDisplayPage({
  createdAt,
  tags,
  content,
}: {
  content: string
  createdAt: Date
  tags: string[]
}) {
  const headings = extractHeadings(content)
  const { body, titleHtml, titleId } = extractTitleAndBody(content)

  return (
    <div className="z-10 min-h-screen backdrop-blur-[1px]">
      <motion.article
        className="flex max-w-3xl flex-1 flex-col gap-4 rounded-sm px-6 py-2"
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: [30, -2, 0],
        }}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.8,
        }}
      >
        {titleHtml != null ? (
          <header className="flex flex-col items-center justify-center gap-3 text-center">
            <h1
              id={titleId || undefined}
              className="text-balance font-bold text-3xl text-zinc-950 leading-tight md:text-4xl dark:text-zinc-50"
              dangerouslySetInnerHTML={{ __html: titleHtml }}
            />

            <section className="flex w-full flex-wrap items-center justify-center gap-2 text-xs text-zinc-600 md:text-sm dark:text-zinc-400">
              <p className="flex flex-wrap items-center justify-center gap-2 [&_span]:border-zinc-400/60 [&_span]:text-zinc-600 dark:[&_span]:border-zinc-600/70 dark:[&_span]:text-zinc-300">
                {tags.map(tag => (
                  <TagItemBadge key={tag} tag={tag} />
                ))}
              </p>

              <time className="border-zinc-400/60 border-b border-dashed font-mono text-[0.78rem] text-zinc-500 tracking-wide md:text-[0.82rem] dark:border-zinc-600/70 dark:text-zinc-400">
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

            <time className="border-zinc-400/60 border-b border-dashed font-mono text-[0.78rem] text-zinc-500 tracking-wide md:text-[0.82rem] dark:border-zinc-600/70 dark:text-zinc-400">
              {toDisplayDate(createdAt)}
            </time>
          </section>
        )}
        {/* 渲染的主要内容 */}
        <main
          id="article-content"
          className={customMarkdownTheme}
          dangerouslySetInnerHTML={{ __html: body }}
        />
        <MarkdownCodeBlockEnhancer rootSelector="#article-content" />
        <PostToc headings={headings} />
      </motion.article>
    </div>
  )
}
