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
          className="motion-safe:animate-entry-icon size-6"
          style={{ animationDelay: `${160 + index * 70}ms` }}
        >
          <Icon role="img" aria-label={name} className="size-full" />
        </li>
      ))}
    </ul>
  )
}
