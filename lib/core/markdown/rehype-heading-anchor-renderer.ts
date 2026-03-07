const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

type NodeLike = {
  type: string
  children?: NodeLike[]
  [key: string]: unknown
}

type ElementLike = NodeLike & {
  type: 'element'
  tagName: string
  properties?: Record<string, unknown>
  children: NodeLike[]
}

type ParentLike = {
  children: NodeLike[]
}

const isElement = (node: unknown): node is ElementLike => {
  return typeof node === 'object' && node !== null && (node as { type?: string }).type === 'element'
}

const readPropertyAsString = (
  properties: Record<string, unknown> | undefined,
  key: string,
): string | null => {
  if (properties == null) return null
  const value = properties[key]
  if (typeof value === 'string' && value.trim().length > 0) return value.trim()
  return null
}

const containsAnchorElement = (node: NodeLike): boolean => {
  if (isElement(node) && node.tagName === 'a') return true
  if (!('children' in node) || !Array.isArray(node.children)) return false
  return node.children.some(containsAnchorElement)
}

const createHeadingAnchor = (id: string, children: NodeLike[]): ElementLike => ({
  type: 'element',
  tagName: 'a',
  properties: {
    href: `#${id}`,
    className: ['md-heading-anchor'],
    'aria-label': 'Anchor link',
  },
  children,
})

const decorateHeading = (headingNode: ElementLike): ElementLike => {
  const headingId = readPropertyAsString(headingNode.properties, 'id')
  if (headingId == null) return headingNode
  if (headingNode.children.some(containsAnchorElement)) return headingNode

  return {
    ...headingNode,
    children: [createHeadingAnchor(headingId, headingNode.children)],
  }
}

const walkAndDecorate = (parent: ParentLike): void => {
  parent.children = parent.children.map(child => {
    if (isElement(child) && HEADING_TAGS.has(child.tagName)) {
      return decorateHeading(child)
    }

    if ('children' in child && Array.isArray(child.children)) {
      walkAndDecorate(child as ParentLike)
    }

    return child
  })
}

export const rehypeHeadingAnchorRenderer = () => {
  return (tree: ParentLike) => {
    walkAndDecorate(tree)
  }
}
