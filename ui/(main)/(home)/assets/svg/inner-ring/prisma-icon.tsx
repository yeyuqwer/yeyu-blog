import type { ComponentProps, FC } from 'react'
import { siPrisma } from 'simple-icons/icons'
import { cn } from '@/lib/utils/common/shadcn'

export const PrismaIcon: FC<ComponentProps<'svg'>> = ({ className, ...props }) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('text-zinc-400 transition-colors duration-300 hover:text-[#2d3748]', className)}
      {...props}
    >
      <path d={siPrisma.path} />
    </svg>
  )
}
