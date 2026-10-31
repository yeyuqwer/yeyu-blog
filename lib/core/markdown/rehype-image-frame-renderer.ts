import 'server-only'

import sharp from 'sharp'

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

const imageDimensionPromises = new Map<string, Promise<{ width: number; height: number }>>()

const getImageDimensions = (src: string) => {
  const existingPromise = imageDimensionPromises.get(src)
  if (existingPromise != null) return existingPromise

  const dimensionPromise = fetch(src, { cache: 'force-cache' }).then(async response => {
    if (!response.ok) {
      throw new Error(`Failed to read image dimensions: ${src}`)
    }

    const metadata = await sharp(Buffer.from(await response.arrayBuffer())).metadata()
    if (metadata.width == null || metadata.height == null) {
      throw new Error(`Image dimensions are missing: ${src}`)
    }

    return {
      width: metadata.width,
      height: metadata.height,
    }
  })

  imageDimensionPromises.set(src, dimensionPromise)
  return dimensionPromise
}

const collectImages = (parent: ParentLike, images: ElementLike[]): void => {
  for (const child of parent.children) {
    if (isElement(child) && child.tagName === 'img') {
      images.push(child)
      continue
    }

    if ('children' in child && Array.isArray(child.children)) {
      collectImages(child as ParentLike, images)
    }
  }
}

const addImageProperties = async (image: ElementLike) => {
  const src = image.properties?.src
  if (typeof src !== 'string' || src.length === 0) {
    throw new Error('Image source is missing')
  }

  const dimensions = await getImageDimensions(src)
  image.properties = {
    ...image.properties,
    loading: 'lazy',
    decoding: 'async',
    height: dimensions.height,
    width: dimensions.width,
  }
}

const createImageFrame = (imageNode: ElementLike): ElementLike => {
  const width = Number(imageNode.properties?.width)
  const height = Number(imageNode.properties?.height)

  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: [
        'md-image-frame',
        'group/article-image',
        '[--image-shimmer-play-state:paused]',
        'data-[article-image-visible=true]:[--image-shimmer-play-state:running]',
        '[--image-shimmer-blue:rgba(96,143,240,0.24)] dark:[--image-shimmer-blue:rgba(122,162,255,0.11)]',
        '[--image-shimmer-purple:rgba(164,120,235,0.26)] dark:[--image-shimmer-purple:rgba(184,146,255,0.13)]',
        '[--image-shimmer-peach:rgba(240,155,120,0.24)] dark:[--image-shimmer-peach:rgba(255,176,146,0.11)]',
        '[--image-shimmer-shade:rgba(100,116,139,0.08)] dark:[--image-shimmer-shade:rgba(113,113,122,0.04)]',
      ],
      'data-article-image-state': 'loading',
      'aria-busy': 'true',
      style: `--md-image-width:${width}px;--md-image-ratio:${width / height}`,
    },
    children: [
      imageNode,
      {
        type: 'element',
        tagName: 'span',
        properties: {
          'aria-hidden': 'true',
          className: [
            'pointer-events-none absolute inset-[var(--md-image-frame-padding)] isolate overflow-hidden rounded-[var(--md-image-radius)] bg-slate-100 opacity-0 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.3)] transition-opacity duration-300 group-data-[article-image-state=loading]/article-image:opacity-100 dark:bg-zinc-900 dark:shadow-none',
          ],
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: [
                'absolute -inset-[30%] bg-[radial-gradient(closest-side,var(--image-shimmer-blue),transparent),radial-gradient(closest-side,var(--image-shimmer-peach),transparent)] bg-size-[60%_60%,55%_55%] [background-position:20%_30%,80%_75%] bg-no-repeat opacity-70 motion-safe:group-data-[article-image-state=loading]/article-image:animate-image-shimmer-drift',
              ],
            },
            children: [],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: [
                'absolute inset-0 bg-[linear-gradient(104deg,transparent_32%,var(--image-shimmer-blue)_42%,var(--image-shimmer-purple)_50%,var(--image-shimmer-peach)_58%,transparent_68%),linear-gradient(118deg,transparent_40%,var(--image-shimmer-shade)_50%,transparent_60%)] bg-size-[300%_100%,340%_100%] bg-no-repeat [background-position:120%_0,135%_0] motion-safe:group-data-[article-image-state=loading]/article-image:animate-image-shimmer',
              ],
            },
            children: [],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: [
                'absolute inset-0 rounded-[inherit] bg-[linear-gradient(104deg,transparent_36%,rgba(122,162,255,0.4)_44%,rgba(184,146,255,0.45)_50%,rgba(255,176,146,0.4)_56%,transparent_64%)] bg-size-[300%_100%] bg-no-repeat p-px [background-position:120%_0] [mask-image:linear-gradient(#000_0_0),linear-gradient(#000_0_0)] [mask-clip:content-box,border-box] [mask-composite:exclude] motion-safe:group-data-[article-image-state=loading]/article-image:animate-image-shimmer',
              ],
            },
            children: [],
          },
        ],
      },
    ],
  }
}

const walkAndDecorate = (parent: ParentLike): void => {
  parent.children = parent.children.map(child => {
    if (isElement(child) && child.tagName === 'img') {
      return createImageFrame(child)
    }

    if ('children' in child && Array.isArray(child.children)) {
      walkAndDecorate(child as ParentLike)
    }

    return child
  })
}

export const rehypeImageFrameRenderer = () => {
  return async (tree: ParentLike) => {
    const images: ElementLike[] = []
    collectImages(tree, images)
    await Promise.all(images.map(addImageProperties))
    walkAndDecorate(tree)
  }
}
