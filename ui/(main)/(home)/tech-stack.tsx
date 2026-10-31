'use client'

import { useTranslations } from '@/ui/components/provider/main/language-provider'
import {
  FigmaIcon,
  HonoIcon,
  NestJsIcon,
  NextJsIcon,
  ReactIcon,
  TypeScriptIcon,
} from './assets/tech-stack-icons'

const techStackData = [
  { name: 'TypeScript', Icon: TypeScriptIcon },
  { name: 'React', Icon: ReactIcon },
  { name: 'Next.js', Icon: NextJsIcon },
  { name: 'Hono', Icon: HonoIcon },
  { name: 'NestJS', Icon: NestJsIcon },
  { name: 'Figma', Icon: FigmaIcon },
]

export default function TechStack() {
  const translations = useTranslations()

  return (
    <ul
      aria-label={translations.home.techStackLabel}
      className="mt-[21px] grid grid-cols-6 gap-[10px]"
    >
      {techStackData.map(({ Icon, name }, index) => (
        <li
          key={name}
          title={name}
          className="group/tech-icon motion-safe:animate-entry-icon size-6"
          style={{ animationDelay: `${100 + index * 28}ms` }}
        >
          <Icon
            role="img"
            aria-label={name}
            className="size-full brightness-0 transition-[filter] duration-200 group-hover/tech-icon:brightness-100 motion-reduce:transition-none dark:invert dark:group-hover/tech-icon:invert-0"
          />
        </li>
      ))}
    </ul>
  )
}
