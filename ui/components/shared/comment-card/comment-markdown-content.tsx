import { cn } from '@/lib/utils/common/shadcn'
import { useCommentMarkdown } from './use-comment-markdown'

export function CommentMarkdownContent({ content }: { content: string }) {
  const html = useCommentMarkdown(content)

  if (html == null) {
    return <p className="whitespace-pre-wrap break-words">{content}</p>
  }

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
