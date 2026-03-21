const LANGUAGE_PREFIXES = ['language-', 'lang-'] as const

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

const toClassNameList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .flatMap(item => String(item).split(/\s+/))
      .map(item => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(/\s+/)
      .map(item => item.trim())
      .filter(Boolean)
  }

  return []
}

const readClassList = (properties: Record<string, unknown> | undefined): string[] => {
  if (properties == null) return []
  return toClassNameList(properties.className ?? properties.class)
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

const extractLanguageFromClasses = (classes: string[]): string | null => {
  for (const className of classes) {
    for (const prefix of LANGUAGE_PREFIXES) {
      if (className.startsWith(prefix) && className.length > prefix.length) {
        return className.slice(prefix.length)
      }
    }
  }

  return null
}

const normalizeLanguage = (language: string | null): string | null => {
  if (language == null) return null

  const normalized = language.trim().toLowerCase()
  if (normalized.length === 0) return null

  return normalized
}

const findCodeElement = (pre: ElementLike): ElementLike | null => {
  for (const child of pre.children) {
    if (isElement(child) && child.tagName === 'code') {
      return child
    }
  }
  return null
}

const resolveCodeLanguage = (pre: ElementLike): string | null => {
  const preProperties = pre.properties
  const preClassList = readClassList(preProperties)

  const languageFromData =
    readPropertyAsString(preProperties, 'data-language') ??
    readPropertyAsString(preProperties, 'data-lang') ??
    readPropertyAsString(preProperties, 'language')
  if (languageFromData != null) {
    return normalizeLanguage(languageFromData)
  }

  const languageFromPreClass = extractLanguageFromClasses(preClassList)
  if (languageFromPreClass != null) {
    return normalizeLanguage(languageFromPreClass)
  }

  const codeElement = findCodeElement(pre)
  if (codeElement == null) return null

  const codeProperties = codeElement.properties
  const codeClassList = readClassList(codeProperties)
  const languageFromCodeData =
    readPropertyAsString(codeProperties, 'data-language') ??
    readPropertyAsString(codeProperties, 'data-lang') ??
    readPropertyAsString(codeProperties, 'language')
  if (languageFromCodeData != null) {
    return normalizeLanguage(languageFromCodeData)
  }

  const languageFromCodeClass = extractLanguageFromClasses(codeClassList)
  return normalizeLanguage(languageFromCodeClass)
}

const isCodeBlockPre = (node: ElementLike): boolean => {
  if (node.tagName !== 'pre') return false

  const preClassList = readClassList(node.properties)
  if (preClassList.includes('shiki') || preClassList.includes('hljs')) return true

  return findCodeElement(node) != null
}

const createCopyButtonRoot = (): ElementLike => ({
  type: 'element',
  tagName: 'span',
  properties: {
    'data-code-copy-root': 'true',
    'aria-hidden': 'true',
  },
  children: [],
})

const createLanguageBadge = (language: string): ElementLike => ({
  type: 'element',
  tagName: 'span',
  properties: {
    className: ['md-code-lang'],
    'aria-hidden': 'true',
  },
  children: [{ type: 'text', value: language.toUpperCase() }],
})

const decoratePreCodeBlock = (preNode: ElementLike): ElementLike => {
  const language = resolveCodeLanguage(preNode)
  const wrapperChildren: NodeLike[] = [createCopyButtonRoot()]

  if (language != null) {
    wrapperChildren.push(createLanguageBadge(language))
  }

  wrapperChildren.push(preNode)

  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['md-code-block'],
      ...(language != null ? { 'data-code-language': language } : {}),
    },
    children: wrapperChildren,
  }
}

const walkAndDecorate = (parent: ParentLike): void => {
  parent.children = parent.children.map(child => {
    if (isElement(child) && isCodeBlockPre(child)) {
      return decoratePreCodeBlock(child)
    }

    if ('children' in child && Array.isArray(child.children)) {
      walkAndDecorate(child as ParentLike)
    }

    return child
  })
}

export const rehypeCodeBlockRenderer = () => {
  return (tree: ParentLike) => {
    walkAndDecorate(tree)
  }
}
