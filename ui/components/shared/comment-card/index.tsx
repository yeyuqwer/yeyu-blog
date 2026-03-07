'use client'

import type { Theme } from '@giscus/react'
import Giscus from '@giscus/react'
import { clientEnv } from '@/config/env/client-env'
import { useTransitionTheme } from '@/hooks/animation'

const commentCardRepo = 'yeyuqwer/yeyu-blog-comment'
const commentCardRepoId = clientEnv.NEXT_PUBLIC_COMMENT_CARD_REPO_ID

// * term 唯一且不可变，用 id 做，防止评论丢失
export default function CommentCard({ term }: { term: string }) {
  const { theme } = useTransitionTheme()

  const commentTheme: Theme = theme === 'light' ? 'light_protanopia' : 'catppuccin_macchiato'

  return (
    <Giscus
      id="comments"
      repo={commentCardRepo}
      repoId={commentCardRepoId}
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
