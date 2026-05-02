const urlPattern = /https?:\/\/[^\s<>"'`]+/g
const trailingUrlTextPattern = /[),.;:!?，。！？；：、]+$/g
const numericIdPattern = /^\d+$/
const twitterHosts = new Set([
  'twitter.com',
  'www.twitter.com',
  'mobile.twitter.com',
  'x.com',
  'www.x.com',
])
const neteaseMusicHosts = new Set(['music.163.com', 'www.music.163.com', 'y.music.163.com'])

export function getMutterContentBlocks(content: string) {
  const blocks: Array<
    | {
        kind: 'text'
        value: string
      }
    | {
        kind: 'twitter'
        id: string
      }
    | {
        kind: 'neteaseMusic'
        id: string
        href: string
      }
    | {
        kind: 'link'
        faviconUrl: string
        hostname: string
        href: string
        label: string
      }
  > = []
  let textStartIndex = 0

  const appendTextBlock = (text: string) => {
    const value = text.replace(/\n{3,}/g, '\n\n').trim()

    if (value.length === 0) {
      return
    }

    const previousBlock = blocks.at(-1)

    if (previousBlock?.kind === 'text') {
      previousBlock.value = `${previousBlock.value}\n${value}`
      return
    }

    blocks.push({
      kind: 'text',
      value,
    })
  }

  for (const match of content.matchAll(urlPattern)) {
    const matchedText = match[0]
    const matchIndex = match.index ?? 0
    const urlText = matchedText.replace(trailingUrlTextPattern, '')
    const nextTextStartIndex = matchIndex + urlText.length

    if (!URL.canParse(urlText)) {
      continue
    }

    const url = new URL(urlText)
    const tweetId = getTweetId(url)

    if (tweetId != null) {
      appendTextBlock(content.slice(textStartIndex, matchIndex))
      blocks.push({
        kind: 'twitter',
        id: tweetId,
      })
      textStartIndex = nextTextStartIndex
      continue
    }

    const neteaseMusicSongId = getNeteaseMusicSongId(url)

    if (neteaseMusicSongId != null) {
      appendTextBlock(content.slice(textStartIndex, matchIndex))
      blocks.push({
        kind: 'neteaseMusic',
        id: neteaseMusicSongId,
        href: url.toString(),
      })
      textStartIndex = nextTextStartIndex
      continue
    }

    appendTextBlock(content.slice(textStartIndex, matchIndex))
    blocks.push({
      kind: 'link',
      faviconUrl: getFaviconUrl(url),
      hostname: url.hostname,
      href: url.toString(),
      label: getLinkLabel(url),
    })
    textStartIndex = nextTextStartIndex
  }

  appendTextBlock(content.slice(textStartIndex))

  return blocks
}

function getFaviconUrl(url: URL) {
  return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url.origin)}&sz=64`
}

function getLinkLabel(url: URL) {
  const pathname = url.pathname === '/' ? '' : url.pathname
  return `${url.hostname}${pathname}${url.search}${url.hash}`
}

function getTweetId(url: URL) {
  if (!twitterHosts.has(url.hostname.toLowerCase())) {
    return null
  }

  const match = url.pathname.match(/\/(?:i\/web\/)?status(?:es)?\/(\d+)/)
  return match?.[1] ?? null
}

function getNeteaseMusicSongId(url: URL) {
  if (!neteaseMusicHosts.has(url.hostname.toLowerCase())) {
    return null
  }

  const id = getNumericId(url.searchParams.get('id'))

  if (id != null && url.pathname.includes('/song')) {
    return id
  }

  if (!url.hash.includes('/song')) {
    return null
  }

  const hashQueryStartIndex = url.hash.indexOf('?')

  if (hashQueryStartIndex === -1) {
    return null
  }

  const hashSearchParams = new URLSearchParams(url.hash.slice(hashQueryStartIndex))
  return getNumericId(hashSearchParams.get('id'))
}

function getNumericId(id: string | null) {
  if (id == null || !numericIdPattern.test(id)) {
    return null
  }

  return id
}
