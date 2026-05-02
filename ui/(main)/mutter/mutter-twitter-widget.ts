export function getCreateTweet() {
  const twttr = Reflect.get(window, 'twttr')

  if (twttr == null || typeof twttr !== 'object') {
    return null
  }

  const widgets = Reflect.get(twttr, 'widgets')

  if (widgets == null || typeof widgets !== 'object') {
    return null
  }

  const createTweet = Reflect.get(widgets, 'createTweet')

  if (typeof createTweet !== 'function') {
    return null
  }

  return createTweet as (
    id: string,
    element: HTMLElement,
    options?: {
      align?: 'left' | 'center' | 'right'
      cards?: 'hidden'
      conversation?: 'none'
      dnt?: boolean
      width?: number
    },
  ) => Promise<HTMLElement>
}
