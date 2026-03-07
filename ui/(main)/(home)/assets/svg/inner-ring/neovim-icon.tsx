import type { ComponentProps, FC } from 'react'
import { siNeovim } from 'simple-icons/icons'
import { cn } from '@/lib/utils/common/shadcn'

export const NeovimIcon: FC<ComponentProps<'svg'>> = ({ className, ...props }) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('text-zinc-400 transition-colors duration-300 hover:text-[#57a143]', className)}
      {...props}
    >
      <path d={siNeovim.path} />
    </svg>
  )
}
