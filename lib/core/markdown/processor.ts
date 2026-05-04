import 'server-only'

import rehypeHighlight from 'rehype-highlight'
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
  .use(rehypeHighlight, { detect: false })
  .use(rehypeCodeBlockRenderer as never)
  .use(rehypeImageFrameRenderer as never)
  .use(rehypeHeadingAnchorRenderer as never)
  .use(rehypeStringify)
