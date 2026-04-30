const className = `
  markdown-content prose prose-base sm:prose-lg max-w-none dark:prose-invert relative
  text-[1.1rem] [text-autospace:normal]

  [--tw-prose-body:#18181b]
  [--tw-prose-headings:#09090b]
  [--tw-prose-lead:#52525b]
  [--tw-prose-links:#000000]
  [--tw-prose-bold:#09090b]
  [--tw-prose-counters:#71717a]
  [--tw-prose-bullets:#a1a1aa]
  [--tw-prose-hr:#d4d4d8]
  [--tw-prose-quotes:#000000]
  [--tw-prose-quote-borders:#000000]
  [--tw-prose-captions:#71717a]
  [--tw-prose-code:#115e59]
  [--tw-prose-pre-code:#e4e4e7]
  [--tw-prose-pre-bg:#18181b]
  [--tw-prose-th-borders:#d4d4d8]
  [--tw-prose-td-borders:#e4e4e7]

  [--tw-prose-invert-body:#e4e4e7]
  [--tw-prose-invert-headings:#fafafa]
  [--tw-prose-invert-lead:#a1a1aa]
  [--tw-prose-invert-links:#ffffff]
  [--tw-prose-invert-bold:#fafafa]
  [--tw-prose-invert-counters:#a1a1aa]
  [--tw-prose-invert-bullets:#737373]
  [--tw-prose-invert-hr:#3f3f46]
  [--tw-prose-invert-quotes:#ffffff]
  [--tw-prose-invert-quote-borders:#ffffff]
  [--tw-prose-invert-captions:#a1a1aa]
  [--tw-prose-invert-code:#fbcfe8]
  [--tw-prose-invert-pre-code:#e4e4e7]
  [--tw-prose-invert-pre-bg:#18181b]
  [--tw-prose-invert-th-borders:#3f3f46]
  [--tw-prose-invert-td-borders:#27272a]

  prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-headings:text-center
  prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:font-bold
  prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:font-bold
  prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:font-semibold
  prose-h4:text-lg sm:prose-h4:text-xl prose-h4:font-semibold
  prose-h5:text-base sm:prose-h5:text-lg prose-h5:font-semibold
  prose-h6:text-sm sm:prose-h6:text-base prose-h6:font-semibold

  prose-p:break-words [&_p:last-child]:mb-0 [&_figure_img]:my-0

  prose-a:break-all prose-a:border-current prose-a:border-b prose-a:no-underline
  prose-a:text-black prose-a:duration-200 prose-a:hover:opacity-70
  dark:prose-a:text-white dark:prose-a:hover:opacity-75
  [&_a.is-link]:text-inherit

  prose-ul:my-4 prose-ol:my-4 prose-ol:pl-10 prose-li:my-2

  prose-blockquote:relative prose-blockquote:border-l-0 prose-blockquote:py-0 prose-blockquote:pl-6
  prose-blockquote:font-normal prose-blockquote:text-black/80 dark:prose-blockquote:text-white/80
  [&_blockquote]:before:absolute [&_blockquote]:before:top-1 [&_blockquote]:before:bottom-1
  [&_blockquote]:before:left-0 [&_blockquote]:before:w-[3px] [&_blockquote]:before:rounded-full
  [&_blockquote]:before:bg-black dark:[&_blockquote]:before:bg-white
  [&_blockquote]:before:content-['']

  prose-hr:mx-0 prose-hr:h-px prose-hr:w-full prose-hr:border-0
  prose-hr:bg-theme-border dark:prose-hr:bg-zinc-200/20
  prose-table:my-5 prose-table:w-full prose-table:overflow-hidden prose-table:rounded-lg
  prose-table:border prose-table:border-separate prose-table:border-spacing-0 prose-table:border-theme-border
  prose-table:bg-theme-surface/90 dark:prose-table:border-zinc-600 dark:prose-table:bg-zinc-950/35
  prose-th:align-middle prose-th:border-0 prose-th:border-b prose-th:border-r prose-th:border-theme-border
  prose-th:bg-theme-background/70 prose-th:text-left prose-th:font-medium prose-th:text-theme-primary
  dark:prose-th:border-zinc-600 dark:prose-th:bg-zinc-900/85 dark:prose-th:text-zinc-100
  prose-td:border-0 prose-td:border-r prose-td:border-b prose-td:border-theme-border dark:prose-td:border-zinc-600
  [&_tbody_tr]:bg-theme-surface/75 dark:[&_tbody_tr]:bg-zinc-950/20
  [&_tbody_tr:nth-child(even)]:bg-theme-background/45 dark:[&_tbody_tr:nth-child(even)]:bg-zinc-900/45
  [&_thead_th]:align-middle [&_thead_th]:py-2 [&_thead_th]:text-left [&_thead_th]:leading-normal
  [&_thead_th_*]:my-0
  [&_th:first-child]:pl-4 [&_td:first-child]:pl-4
  [&_tr>*:last-child]:border-r-0 [&_tbody_tr:last-child>*]:border-b-0

  prose-code:rounded-md prose-code:bg-zinc-900/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono
  prose-code:text-[0.85em] prose-code:text-zinc-700 dark:prose-code:bg-zinc-50/10 dark:prose-code:text-zinc-200
  prose-code:before:content-[''] prose-code:after:content-['']
  prose-pre:my-6 prose-pre:overflow-hidden prose-pre:rounded-lg prose-pre:border prose-pre:border-zinc-700
  prose-pre:bg-[var(--tw-prose-pre-bg)] prose-pre:p-0 prose-pre:py-0 prose-pre:leading-relaxed prose-pre:text-zinc-100
  dark:prose-pre:border-transparent dark:prose-pre:bg-[var(--tw-prose-invert-pre-bg)] dark:prose-pre:text-zinc-100
  [&_pre_code]:bg-transparent! [&_pre_code]:p-0 [&_pre_code]:py-4 [&_pre_code]:rounded-none
  [&_pre_code]:text-inherit [&_pre_code]:before:content-none [&_pre_code]:after:content-none

  [&_kbd]:rounded-lg [&_kbd]:border [&_kbd]:border-zinc-200 [&_kbd]:border-b-2 [&_kbd]:bg-zinc-50
  [&_kbd]:px-1.5 [&_kbd]:py-0.5 [&_kbd]:font-mono [&_kbd]:text-sm [&_kbd]:text-zinc-700
  dark:[&_kbd]:border-zinc-700 dark:[&_kbd]:bg-zinc-900 dark:[&_kbd]:text-zinc-200

  prose-img:m-0 prose-img:block prose-img:w-full prose-img:bg-transparent prose-img:p-0

  [&_summary]:list-none [&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:duration-200
  [&_summary:hover]:opacity-80 [&_summary::-webkit-details-marker]:hidden

  [&_mark]:rounded-sm [&_mark]:bg-[#33a6b8]/30 [&_mark]:px-1 [&_mark]:text-current
  dark:[&_mark]:bg-[#f596aa]/35

  [&_.hljs]:px-5 [&_.hljs]:py-0
  [&_pre.shiki]:py-0
  [&_pre.shiki_code]:flex [&_pre.shiki_code]:flex-col
  [&_pre.shiki_.line]:block
  [&_pre.shiki_.line:first-child:empty]:hidden
  [&_pre.shiki_.line:last-child:empty]:hidden
`

export const customMarkdownTheme = className
