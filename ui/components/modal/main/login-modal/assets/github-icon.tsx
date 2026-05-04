import type { ComponentProps, FC } from 'react'
import { siGithub } from 'simple-icons'

export const GitHubIcon: FC<ComponentProps<'svg'>> = props => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label={siGithub.title} {...props}>
      <path d={siGithub.path} />
    </svg>
  )
}
