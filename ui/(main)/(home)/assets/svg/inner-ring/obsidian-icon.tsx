import type { ComponentProps, FC } from 'react'
import { siObsidian } from 'simple-icons/icons'
import { cn } from '@/lib/utils/common/shadcn'

export const ObsidianIcon: FC<ComponentProps<'svg'>> = ({ className, ...props }) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('text-zinc-400 transition-colors duration-300 hover:text-[#7c3aed]', className)}
      {...props}
    >
      <path d={siObsidian.path} />
    </svg>
  )
}
