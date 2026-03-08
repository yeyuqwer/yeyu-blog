export const extractTitleAndBody = (html: string) => {
  const firstH1Regex = /<h1([^>]*)>([\s\S]*?)<\/h1>/i
  const match = firstH1Regex.exec(html)

  if (match == null) {
    return {
      body: html,
      titleHtml: null,
      titleId: '',
    }
  }

  const attrs = match[1] ?? ''
  const titleIdMatch = attrs.match(/\sid="([^"]+)"/)

  return {
    body: html.replace(firstH1Regex, ''),
    titleHtml: match[2],
    titleId: titleIdMatch?.[1] ?? '',
  }
}
