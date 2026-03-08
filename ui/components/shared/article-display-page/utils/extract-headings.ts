export type Heading = {
  level: number
  text: string
  id: string
}

export const extractHeadings = (html: string) => {
  const regex = /<h([1-6])(?:[^>]*id="([^"]*)")?[^>]*>(.*?)<\/h\1>/g
  const headings: Heading[] = []
  const matches = html.matchAll(regex)

  for (const match of matches) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2] ?? '',
      text: match[3].replace(/<[^>]*>/g, ''),
    })
  }
  return headings
}
