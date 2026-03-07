import * as motion from 'motion/react-client'
import { customMarkdownTheme } from '@/lib/core/markdown'
import MarkdownCodeBlockEnhancer from '@/ui/components/shared/markdown-code-block-enhancer'
import ArticleDisplayHeader from './internal/article-display-header'
import { type Heading, PostToc } from './internal/post-toc'

function extractHeadings(html: string): Heading[] {
  const regex = /<h([1-6])(?:[^>]*id="([^"]*)")?[^>]*>(.*?)<\/h\1>/g
  const headings: Heading[] = []
  const matches = html.matchAll(regex)

  for (const match of matches) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2] ?? '',
      text: match[3].replace(/<[^>]*>/g, ''),
    })
  }
  return headings
}

export default function ArticleDisplayPage({
  title,
  createdAt,
  tags,
  content,
}: {
  title: string
  content: string
  createdAt: Date
  tags: string[]
}) {
  const headings = extractHeadings(content)

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
        <ArticleDisplayHeader title={title} createdAt={createdAt} tags={tags} />
        {/* 渲染的主要内容 */}
        <main
          id="article-content"
          className={customMarkdownTheme}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <MarkdownCodeBlockEnhancer rootSelector="#article-content" />
        <PostToc headings={headings} />
      </motion.article>
    </div>
  )
}
