'use client'

import type { Theme } from '@giscus/react'
import Giscus from '@giscus/react'
import { COMMENT_CARD_REPO, COMMENT_CARD_REPO_ID } from '@/config/constant'
import { useTransitionTheme } from '@/hooks/animation'

// * term 唯一且不可变，用 id 做，防止评论丢失
export default function CommentCard({ term }: { term: string }) {
  const { theme } = useTransitionTheme()

  const commentTheme: Theme = theme === 'light' ? 'light_protanopia' : 'catppuccin_macchiato'

  return (
    <Giscus
      id="comments"
      repo={COMMENT_CARD_REPO}
      repoId={COMMENT_CARD_REPO_ID}
      category="Announcements"
      categoryId="DIC_kwDOOiAAJM4Cpm1t"
      mapping="specific"
      term={term}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={commentTheme}
      lang="zh-CN"
      loading="lazy"
    />
  )
}
