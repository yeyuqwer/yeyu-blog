// * markdown 主题配置（参考 refer 项目）
// * 采用中性排版 + 单一强调色（链接、引用条、标记）
// * 统一覆盖 prose、markdown 元素和代码高亮（hljs / shiki）配色
const className = `
  markdown-content prose prose-base sm:prose-lg max-w-none dark:prose-invert relative
  text-[1.1rem] [text-autospace:normal]

  [--tw-prose-body:#18181b]
  [--tw-prose-headings:#09090b]
  [--tw-prose-lead:#52525b]
  [--tw-prose-links:#0f766e]
  [--tw-prose-bold:#09090b]
  [--tw-prose-counters:#71717a]
  [--tw-prose-bullets:#a1a1aa]
  [--tw-prose-hr:#d4d4d8]
  [--tw-prose-quotes:#3f3f46]
  [--tw-prose-quote-borders:#33a6b8]
  [--tw-prose-captions:#71717a]
  [--tw-prose-code:#115e59]
  [--tw-prose-pre-code:#27272a]
  [--tw-prose-pre-bg:#f4f4f5]
  [--tw-prose-th-borders:#d4d4d8]
  [--tw-prose-td-borders:#e4e4e7]

  [--tw-prose-invert-body:#e4e4e7]
  [--tw-prose-invert-headings:#fafafa]
  [--tw-prose-invert-lead:#a1a1aa]
  [--tw-prose-invert-links:#f596aa]
  [--tw-prose-invert-bold:#fafafa]
  [--tw-prose-invert-counters:#a1a1aa]
  [--tw-prose-invert-bullets:#737373]
  [--tw-prose-invert-hr:#3f3f46]
  [--tw-prose-invert-quotes:#d4d4d8]
  [--tw-prose-invert-quote-borders:#f596aa]
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
  prose-a:text-[#0f766e] prose-a:duration-200 prose-a:hover:text-[#0d9488]
  dark:prose-a:text-[#f596aa] dark:prose-a:hover:text-[#f9a8d4]
  [&_a.is-link]:text-inherit [&_a.is-link]:hover:text-[#0d9488]
  dark:[&_a.is-link]:hover:text-[#f9a8d4]

  prose-ul:my-4 prose-ol:my-4 prose-li:my-2

  prose-blockquote:relative prose-blockquote:border-l-0 prose-blockquote:py-0 prose-blockquote:pl-6
  prose-blockquote:font-normal prose-blockquote:text-zinc-700 dark:prose-blockquote:text-zinc-300
  [&_blockquote]:before:absolute [&_blockquote]:before:top-1 [&_blockquote]:before:bottom-1
  [&_blockquote]:before:left-0 [&_blockquote]:before:w-[3px] [&_blockquote]:before:rounded-full
  [&_blockquote]:before:bg-[#33a6b8] dark:[&_blockquote]:before:bg-[#f596aa]
  [&_blockquote]:before:content-['']

  prose-hr:mx-0 prose-hr:w-full prose-hr:border-zinc-400/20 dark:prose-hr:border-zinc-200/20
  prose-table:my-5 prose-table:w-full
  prose-th:align-middle prose-th:border prose-th:border-zinc-200 prose-th:bg-zinc-100 prose-th:font-medium
  dark:prose-th:border-zinc-700 dark:prose-th:bg-zinc-800
  prose-td:border prose-td:border-zinc-200 dark:prose-td:border-zinc-700
  [&_thead_th]:align-middle [&_thead_th]:py-2 [&_thead_th]:leading-normal
  [&_thead_th_*]:my-0
  [&_th:first-child]:pl-4 [&_td:first-child]:pl-4

  prose-code:rounded-md prose-code:bg-zinc-900/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono
  prose-code:text-[0.85em] prose-code:text-zinc-700 dark:prose-code:bg-zinc-50/10 dark:prose-code:text-zinc-200
  prose-code:before:content-[''] prose-code:after:content-['']
  prose-pre:my-6 prose-pre:overflow-hidden prose-pre:rounded-sm prose-pre:border prose-pre:border-transparent
  prose-pre:bg-transparent prose-pre:p-0 prose-pre:py-0 prose-pre:leading-relaxed prose-pre:text-zinc-800
  dark:prose-pre:text-zinc-100
  [&_pre_code]:bg-transparent! [&_pre_code]:p-0 [&_pre_code]:py-4 [&_pre_code]:rounded-none
  [&_pre_code]:text-inherit [&_pre_code]:before:content-none [&_pre_code]:after:content-none

  [&_kbd]:rounded-lg [&_kbd]:border [&_kbd]:border-zinc-200 [&_kbd]:border-b-2 [&_kbd]:bg-zinc-50
  [&_kbd]:px-1.5 [&_kbd]:py-0.5 [&_kbd]:font-mono [&_kbd]:text-sm [&_kbd]:text-zinc-700
  dark:[&_kbd]:border-zinc-700 dark:[&_kbd]:bg-zinc-900 dark:[&_kbd]:text-zinc-200

  prose-img:m-auto prose-img:w-[92%] md:prose-img:w-[96%] prose-img:rounded-lg prose-img:border prose-img:border-zinc-200
  dark:prose-img:border-zinc-700 prose-img:transition-transform prose-img:duration-300 prose-img:hover:scale-[1.01]

  [&_.task-list-item]:my-2 [&_.task-list-item]:list-none [&_.task-list-item]:flex [&_.task-list-item]:items-center
  [&_.task-list-item>input]:mr-2 [&_.task-list-item>input]:size-3.5 [&_.task-list-item>input]:rounded-sm
  [&_.task-list-item>input]:align-middle [&_.task-list-item>input]:accent-[#33a6b8]
  dark:[&_.task-list-item>input]:accent-[#f596aa] [&_.task-list-item>input:disabled]:cursor-not-allowed

  [&_summary]:list-none [&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:duration-200
  [&_summary:hover]:opacity-80 [&_summary::-webkit-details-marker]:hidden

  [&_mark]:rounded-sm [&_mark]:bg-[#33a6b8]/30 [&_mark]:px-1 [&_mark]:text-current
  dark:[&_mark]:bg-[#f596aa]/35

  [&_.hljs]:rounded-none [&_.hljs]:border-0 [&_.hljs]:bg-transparent! [&_.hljs]:px-5 [&_.hljs]:py-0
  [&_pre.shiki]:rounded-none [&_pre.shiki]:border-0 [&_pre.shiki]:bg-transparent! [&_pre.shiki]:py-0
  [&_pre.shiki_code]:flex [&_pre.shiki_code]:flex-col
  [&_pre.shiki_.line]:block
  [&_pre.shiki_.line:first-child:empty]:hidden
  [&_pre.shiki_.line:last-child:empty]:hidden
`

export const customMarkdownTheme = className
