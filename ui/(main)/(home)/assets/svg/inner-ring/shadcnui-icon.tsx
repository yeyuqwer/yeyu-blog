import type { ComponentProps, FC } from 'react'
import { siShadcnui } from 'simple-icons/icons'
import { cn } from '@/lib/utils/common/shadcn'

export const ShadcnuiIcon: FC<ComponentProps<'svg'>> = ({ className, ...props }) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn(
        'text-zinc-400 transition-colors duration-300 hover:text-[#000000] dark:hover:text-[#ffffff]',
        className,
      )}
      {...props}
    >
      <path d={siShadcnui.path} />
    </svg>
  )
}
