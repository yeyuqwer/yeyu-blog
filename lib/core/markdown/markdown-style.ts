// * markdown 主题配置
// * 颜色主要参考 Catppuccin Mocha，并兼容 Latte 亮色模式
// * 统一覆盖 prose、markdown 元素和代码高亮（hljs / shiki）配色
const className = `
  markdown-content prose prose-base sm:prose-lg max-w-none dark:prose-invert

  [--tw-prose-body:#4c4f69]
  [--tw-prose-headings:#1e1e2e]
  [--tw-prose-lead:#5c5f77]
  [--tw-prose-links:#1e66f5]
  [--tw-prose-bold:#1e1e2e]
  [--tw-prose-counters:#6c6f85]
  [--tw-prose-bullets:#8c8fa1]
  [--tw-prose-hr:#ccd0da]
  [--tw-prose-quotes:#5c5f77]
  [--tw-prose-quote-borders:#9ca0b0]
  [--tw-prose-captions:#6c6f85]
  [--tw-prose-code:#8839ef]
  [--tw-prose-pre-code:#4c4f69]
  [--tw-prose-pre-bg:#eff1f5]
  [--tw-prose-th-borders:#bcc0cc]
  [--tw-prose-td-borders:#dce0e8]

  [--tw-prose-invert-body:#cdd6f4]
  [--tw-prose-invert-headings:#f5e0dc]
  [--tw-prose-invert-lead:#bac2de]
  [--tw-prose-invert-links:#89b4fa]
  [--tw-prose-invert-bold:#f5e0dc]
  [--tw-prose-invert-counters:#a6adc8]
  [--tw-prose-invert-bullets:#9399b2]
  [--tw-prose-invert-hr:#45475a]
  [--tw-prose-invert-quotes:#f2cdcd]
  [--tw-prose-invert-quote-borders:#585b70]
  [--tw-prose-invert-captions:#a6adc8]
  [--tw-prose-invert-code:#cba6f7]
  [--tw-prose-invert-pre-code:#cdd6f4]
  [--tw-prose-invert-pre-bg:#1e1e2e]
  [--tw-prose-invert-th-borders:#585b70]
  [--tw-prose-invert-td-borders:#313244]

  prose-headings:tracking-tight
  prose-h1:text-3xl sm:prose-h1:text-5xl
  prose-h2:text-2xl sm:prose-h2:text-4xl
  prose-h3:text-xl sm:prose-h3:text-3xl
  prose-h4:text-lg sm:prose-h4:text-2xl
  prose-h5:text-base sm:prose-h5:text-xl
  prose-h6:text-base sm:prose-h6:text-xl

  prose-h1:text-[#e64553] dark:prose-h1:text-[#f38ba8]
  prose-h2:text-[#fe640b] dark:prose-h2:text-[#fab387]
  prose-h3:text-[#df8e1d] dark:prose-h3:text-[#f9e2af]
  prose-h4:text-[#1e66f5] dark:prose-h4:text-[#a6e3a1]
  prose-h5:text-[#7287fd] dark:prose-h5:text-[#89b4fa]
  prose-h6:text-[#209fb5] dark:prose-h6:text-[#b4befe]

  prose-h1:text-center
  prose-h2:text-center
  prose-h3:text-center
  prose-h4:text-center
  prose-h5:text-center
  prose-h6:text-center

  prose-strong:font-extrabold prose-strong:text-[#209fb5] dark:prose-strong:text-[#74c7ec]
  prose-em:text-[#40a02b] dark:prose-em:text-[#a6e3a1]
  prose-del:text-[#e64553] dark:prose-del:text-[#eba0ac]

  prose-code:font-normal prose-code:font-mono prose-code:text-[#8839ef] dark:prose-code:text-[#cba6f7]
  prose-code:bg-[#e6e9ef] dark:prose-code:bg-[#313244]
  prose-code:px-1 prose-code:py-0.5 prose-code:rounded
  prose-code:before:content-[''] prose-code:after:content-['']
  prose-pre:bg-[#eff1f5] prose-pre:text-[#4c4f69]
  dark:prose-pre:bg-[#1e1e2e] dark:prose-pre:text-[#cdd6f4]
  prose-pre:border-dashed prose-pre:border-[#1babbb]! dark:prose-pre:border-[#4452cf]!
  prose-pre:rounded-sm! prose-pre:shadow-xs
  prose-pre:my-4 prose-pre:py-2.5 prose-pre:px-4
  [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none
  [&_pre_code]:text-inherit [&_pre_code]:before:content-none [&_pre_code]:after:content-none

  prose-a:text-[#1e66f5] prose-a:decoration-[#7287fd]/50 prose-a:underline prose-a:underline-offset-2
  prose-a:hover:text-[#209fb5] prose-a:hover:decoration-[#209fb5]/70
  dark:prose-a:text-[#89b4fa] dark:prose-a:decoration-[#74c7ec]/50
  dark:prose-a:hover:text-[#74c7ec] dark:prose-a:hover:decoration-[#89dceb]/70
  prose-a:transition-colors

  prose-ul:marker:text-[#7287fd] dark:prose-ul:marker:text-[#89dceb]
  prose-ol:marker:text-[#7287fd] dark:prose-ol:marker:text-[#89dceb]

  prose-blockquote:text-[#5c5f77] prose-blockquote:border-l-[#7287fd] prose-blockquote:bg-[#eff1f5]/70
  dark:prose-blockquote:text-[#f2cdcd] dark:prose-blockquote:border-l-[#b4befe] dark:prose-blockquote:bg-[#181825]/70
  prose-blockquote:rounded-r-md prose-blockquote:px-4 prose-blockquote:py-px prose-blockquote:font-normal

  prose-hr:border-[#ccd0da] dark:prose-hr:border-[#45475a]
  prose-th:text-[#4c4f69] dark:prose-th:text-[#cdd6f4]
  prose-th:border-b-[#bcc0cc] dark:prose-th:border-b-[#585b70]
  prose-td:border-b-[#dce0e8] dark:prose-td:border-b-[#313244]
  prose-figcaption:text-[#6c6f85] dark:prose-figcaption:text-[#a6adc8]

  [&_mark]:rounded-sm [&_mark]:px-1 [&_mark]:py-0.5
  [&_mark]:bg-[#f2d5cf] [&_mark]:text-[#4c4f69]
  dark:[&_mark]:bg-[#f5e0dc] dark:[&_mark]:text-[#181825]

  [&_kbd]:rounded [&_kbd]:border [&_kbd]:border-[#bcc0cc] dark:[&_kbd]:border-[#585b70]
  [&_kbd]:bg-[#e6e9ef] dark:[&_kbd]:bg-[#313244]
  [&_kbd]:px-1.5 [&_kbd]:py-0.5 [&_kbd]:font-mono
  [&_kbd]:text-[#5c5f77] dark:[&_kbd]:text-[#bac2de]

  prose-img:border prose-img:border-dashed prose-img:rounded-sm prose-img:border-[#1babbb]
  dark:prose-img:border-[#4452cf]
  prose-img:p-1 prose-img:hover:scale-[1.02] prose-img:duration-300
  prose-img:m-auto

  [&_.task-list-item>input]:accent-[#1e66f5] dark:[&_.task-list-item>input]:accent-[#89b4fa]

  [&_.hljs]:!bg-[#eff1f5] dark:[&_.hljs]:!bg-[#1e1e2e]
  [&_.hljs]:!text-[#4c4f69] dark:[&_.hljs]:!text-[#cdd6f4]
  [&_.hljs]:rounded-md [&_.hljs]:border [&_.hljs]:border-[#ccd0da]
  dark:[&_.hljs]:border-[#45475a]
  [&_.hljs]:px-4 [&_.hljs]:py-3
  [&_.hljs-subst]:!text-[#4c4f69] dark:[&_.hljs-subst]:!text-[#cdd6f4]
  [&_.hljs-comment]:!text-[#9ca0b0] dark:[&_.hljs-comment]:!text-[#6c7086]
  [&_.hljs-quote]:!text-[#9ca0b0] dark:[&_.hljs-quote]:!text-[#6c7086]
  [&_.hljs-keyword]:!text-[#8839ef] dark:[&_.hljs-keyword]:!text-[#cba6f7]
  [&_.hljs-selector-tag]:!text-[#8839ef] dark:[&_.hljs-selector-tag]:!text-[#cba6f7]
  [&_.hljs-section]:!text-[#8839ef] dark:[&_.hljs-section]:!text-[#cba6f7]
  [&_.hljs-doctag]:!text-[#8839ef] dark:[&_.hljs-doctag]:!text-[#cba6f7]
  [&_.hljs-meta_.hljs-keyword]:!text-[#8839ef] dark:[&_.hljs-meta_.hljs-keyword]:!text-[#cba6f7]
  [&_.hljs-attr]:!text-[#1e66f5] dark:[&_.hljs-attr]:!text-[#89b4fa]
  [&_.hljs-built_in]:!text-[#1e66f5] dark:[&_.hljs-built_in]:!text-[#89b4fa]
  [&_.hljs-title]:!text-[#1e66f5] dark:[&_.hljs-title]:!text-[#89b4fa]
  [&_.hljs-literal]:!text-[#1e66f5] dark:[&_.hljs-literal]:!text-[#89b4fa]
  [&_.hljs-attribute]:!text-[#40a02b] dark:[&_.hljs-attribute]:!text-[#a6e3a1]
  [&_.hljs-string]:!text-[#40a02b] dark:[&_.hljs-string]:!text-[#a6e3a1]
  [&_.hljs-regexp]:!text-[#40a02b] dark:[&_.hljs-regexp]:!text-[#a6e3a1]
  [&_.hljs-symbol]:!text-[#40a02b] dark:[&_.hljs-symbol]:!text-[#a6e3a1]
  [&_.hljs-variable]:!text-[#40a02b] dark:[&_.hljs-variable]:!text-[#a6e3a1]
  [&_.hljs-template-variable]:!text-[#40a02b] dark:[&_.hljs-template-variable]:!text-[#a6e3a1]
  [&_.hljs-link]:!text-[#40a02b] dark:[&_.hljs-link]:!text-[#a6e3a1]
  [&_.hljs-selector-attr]:!text-[#40a02b] dark:[&_.hljs-selector-attr]:!text-[#a6e3a1]
  [&_.hljs-name]:!text-[#fe640b] dark:[&_.hljs-name]:!text-[#fab387]
  [&_.hljs-type]:!text-[#fe640b] dark:[&_.hljs-type]:!text-[#fab387]
  [&_.hljs-number]:!text-[#fe640b] dark:[&_.hljs-number]:!text-[#fab387]
  [&_.hljs-selector-id]:!text-[#fe640b] dark:[&_.hljs-selector-id]:!text-[#fab387]
  [&_.hljs-template-tag]:!text-[#fe640b] dark:[&_.hljs-template-tag]:!text-[#fab387]
  [&_.hljs-selector-class]:!text-[#df8e1d] dark:[&_.hljs-selector-class]:!text-[#f9e2af]
  [&_.hljs-bullet]:!text-[#df8e1d] dark:[&_.hljs-bullet]:!text-[#f9e2af]
  [&_.hljs-code]:!text-[#df8e1d] dark:[&_.hljs-code]:!text-[#f9e2af]
  [&_.hljs-meta]:!text-[#209fb5] dark:[&_.hljs-meta]:!text-[#94e2d5]
  [&_.hljs-selector-pseudo]:!text-[#209fb5] dark:[&_.hljs-selector-pseudo]:!text-[#94e2d5]
  [&_.hljs-meta_.hljs-string]:!text-[#40a02b] dark:[&_.hljs-meta_.hljs-string]:!text-[#a6e3a1]
  [&_.hljs-deletion]:!text-[#e64553] dark:[&_.hljs-deletion]:!text-[#f38ba8]
  [&_.hljs-addition]:!text-[#40a02b] dark:[&_.hljs-addition]:!text-[#a6e3a1]
  [&_.hljs-emphasis]:italic
  [&_.hljs-strong]:font-semibold

  [&_pre.shiki]:!bg-[#eff1f5] dark:[&_pre.shiki]:!bg-[#1e1e2e]
  [&_pre.shiki]:!text-[#4c4f69] dark:[&_pre.shiki]:!text-[#cdd6f4]
  [&_pre.shiki]:border [&_pre.shiki]:border-[#ccd0da]
  dark:[&_pre.shiki]:border-[#45475a]
  [&_pre.shiki]:rounded-lg
  [&_pre.shiki_.line]:block
  [&_pre.shiki_.line:first-child:empty]:hidden
  [&_pre.shiki_.line:last-child:empty]:hidden
  [&_pre.shiki_.line.highlighted]:bg-[#04a5e5]/10 dark:[&_pre.shiki_.line.highlighted]:bg-[#89dceb]/20
  [&_pre.shiki_.line.diff.add]:bg-[#40a02b]/15 dark:[&_pre.shiki_.line.diff.add]:bg-[#a6e3a1]/20
  [&_pre.shiki_.line.diff.remove]:bg-[#e64553]/15 dark:[&_pre.shiki_.line.diff.remove]:bg-[#f38ba8]/20
  [&_pre.shiki_span.highlighted-word]:rounded
  [&_pre.shiki_span.highlighted-word]:bg-[#209fb5]/20 dark:[&_pre.shiki_span.highlighted-word]:bg-[#74c7ec]/25
`

export const customMarkdownTheme = className
