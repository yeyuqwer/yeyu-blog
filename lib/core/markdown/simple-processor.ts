import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { rehypeCodeBlockRenderer } from './rehype-code-block-renderer'
import { rehypeHeadingAnchorRenderer } from './rehype-heading-anchor-renderer'

export const simpleProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeHighlight, { detect: false })
  .use(rehypeCodeBlockRenderer as never)
  .use(rehypeHeadingAnchorRenderer as never)
  .use(rehypeStringify)
