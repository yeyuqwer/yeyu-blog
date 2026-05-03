import type { ReactNode } from 'react'
import {
  GitHubActionsIcon,
  GitIcon,
  NeovimIcon,
  ObsidianIcon,
  PrismaIcon,
  ShadcnuiIcon,
  VimIcon,
} from './assets/svg/inner-ring'
// * svg
import {
  NestjsIcon,
  NextjsIcon,
  NodejsIcon,
  ReactIcon,
  ReactQueryIcon,
  TailwindcssIcon,
  TypeScriptIcon,
  WagmiIcon,
} from './assets/svg/outer-ring'
import { TechStackRings } from './tech-stack-rings'

const outerRingTechStackData = [
  {
    key: 'ts',
    component: <TypeScriptIcon className="size-full" />,
  },
  {
    key: 'react',
    component: <ReactIcon className="size-full" />,
  },
  {
    key: 'tailwindcss',
    component: <TailwindcssIcon className="size-full" />,
  },
  {
    key: 'next',
    component: <NextjsIcon className="size-full" />,
  },
  {
    key: 'nest',
    component: <NestjsIcon className="size-full" />,
  },
  {
    key: 'node',
    component: <NodejsIcon className="size-full" />,
  },
  {
    key: 'react-query',
    component: <ReactQueryIcon className="size-full" />,
  },
  {
    key: 'wagmi',
    component: <WagmiIcon className="size-full" />,
  },
] satisfies { key: string; component: ReactNode }[]

const innerRingTechStackData = [
  {
    key: 'github actions',
    component: <GitHubActionsIcon className="size-full" />,
  },
  {
    key: 'git',
    component: <GitIcon className="size-full" />,
  },
  {
    key: 'neovim',
    component: <NeovimIcon className="size-full" />,
  },
  {
    key: 'obsidian',
    component: <ObsidianIcon className="size-full" />,
  },
  {
    key: 'prisma',
    component: <PrismaIcon className="size-full" />,
  },
  {
    key: 'shadcnui',
    component: <ShadcnuiIcon className="size-full" />,
  },
  {
    key: 'vim',
    component: <VimIcon className="size-full" />,
  },
] satisfies { key: string; component: ReactNode }[]

const outerTechStackData = [...outerRingTechStackData, ...outerRingTechStackData]
const innerTechStackData = [...innerRingTechStackData, ...innerRingTechStackData]
const ringBaseCount = Math.max(outerRingTechStackData.length, innerRingTechStackData.length)

function TechStack() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="mask-[linear-gradient(to_bottom,black_70%,transparent_100%)] flex h-44 justify-center overflow-hidden md:mt-20 md:h-88">
        <div className="mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] flex w-full justify-center pt-12">
          <TechStackRings
            outerItems={outerTechStackData}
            innerItems={innerTechStackData}
            ringBaseCount={ringBaseCount}
          />
        </div>
      </div>
    </div>
  )
}

export default TechStack
