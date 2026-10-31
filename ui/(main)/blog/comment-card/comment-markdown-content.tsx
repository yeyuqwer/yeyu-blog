import { cn } from '@/lib/utils/common/shadcn'

export function CommentMarkdownContent({ sanitizedHtmlContent }: { sanitizedHtmlContent: string }) {
  return (
    <div
      className={cn(
        'markdown-content prose prose-sm prose-zinc dark:prose-invert max-w-none text-sm leading-6 [overflow-wrap:anywhere] text-black/85 dark:text-white/85',
        'prose-headings:mt-5 prose-headings:mb-2 prose-headings:text-left prose-headings:text-black prose-headings:tracking-tight dark:prose-headings:text-white',
        'prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-sm prose-h5:text-sm prose-h6:text-sm',
        'prose-p:my-0 prose-p:break-words prose-p:text-inherit [&_p+p]:mt-2 [&_p:last-child]:mb-0',
        'prose-a:break-all prose-a:border-current prose-a:border-b prose-a:text-black prose-a:no-underline prose-a:duration-200 prose-a:hover:text-black/65 dark:prose-a:text-white dark:prose-a:hover:text-white/70',
        'prose-li:my-1 prose-ol:my-3 prose-ul:my-3 prose-li:text-inherit',
        'prose-blockquote:my-3 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:font-normal prose-blockquote:text-black/70 dark:prose-blockquote:text-white/70',
        'prose-img:my-3 prose-pre:my-4 prose-pre:overflow-x-auto prose-img:rounded-md prose-pre:rounded-md prose-code:text-black prose-pre:text-black dark:prose-code:text-white dark:prose-pre:text-white',
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }}
    />
  )
}
