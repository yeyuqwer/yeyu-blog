import { useEffect, useState } from 'react'
import { commentProcessor } from '@/lib/core/markdown/comment-processor'

export function useCommentMarkdown(content: string) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setHtml(null)

    void commentProcessor.process(content).then(file => {
      if (active) {
        setHtml(String(file))
      }
    })

    return () => {
      active = false
    }
  }, [content])

  return html
}
