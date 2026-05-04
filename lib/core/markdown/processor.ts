import 'server-only'

import type { BuiltinTheme } from 'shiki'
import rehypeShiki from '@shikijs/rehype'
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRemoveLineBreak,
  transformerRemoveNotationEscape,
} from '@shikijs/transformers'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { rehypeCodeBlockRenderer } from './rehype-code-block-renderer'
import { rehypeHeadingAnchorRenderer } from './rehype-heading-anchor-renderer'
import { rehypeImageFrameRenderer } from './rehype-image-frame-renderer'

export const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeShiki, {
    themes: {
      dark: 'catppuccin-mocha',
      light: 'catppuccin-mocha',
    } satisfies Record<'dark' | 'light', BuiltinTheme>,
    defaultColor: false,
    addLanguageClass: true,
    transformers: [
      transformerRemoveNotationEscape(),
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationFocus(),
      transformerNotationWordHighlight(),
      transformerNotationErrorLevel(),
      transformerMetaHighlight(),
      transformerMetaWordHighlight(),
      transformerRemoveLineBreak(),
    ],
  })
  .use(rehypeCodeBlockRenderer as never)
  .use(rehypeImageFrameRenderer as never)
  .use(rehypeHeadingAnchorRenderer as never)
  .use(rehypeStringify)
