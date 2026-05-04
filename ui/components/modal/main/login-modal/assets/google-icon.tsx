import type { ComponentProps, FC } from 'react'
import { siGoogle } from 'simple-icons'

export const GoogleIcon: FC<ComponentProps<'svg'>> = props => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label={siGoogle.title} {...props}>
      <path d={siGoogle.path} />
    </svg>
  )
}
