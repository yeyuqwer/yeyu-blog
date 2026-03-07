'use client'

import type { JSX } from 'react'
import {
  type MotionStyle,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'
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

type TechItem = {
  key: string
  component: JSX.Element
}

const outerRingTechStackData: TechItem[] = [
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
]

const innerRingTechStackData: TechItem[] = [
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
]

const outerTechStackData: TechItem[] = [...outerRingTechStackData, ...outerRingTechStackData]
const innerTechStackData: TechItem[] = [...innerRingTechStackData, ...innerRingTechStackData]
const ringBaseCount = Math.max(outerRingTechStackData.length, innerRingTechStackData.length)

function TechStack() {
  const rotation = useMotionValue(0)
  const reverseRotation = useTransform(rotation, value => -value)
  const speed = useSpring(1, { stiffness: 40, damping: 20 })

  useAnimationFrame((_time, delta) => {
    const currentRotation = rotation.get()
    const currentSpeed = speed.get()
    // 360 degrees in 24 seconds (24000 ms)
    const baseSpeed = 360 / 24000
    rotation.set(currentRotation + baseSpeed * delta * currentSpeed)
  })

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="mask-[linear-gradient(to_bottom,black_70%,transparent_100%)] flex h-44 justify-center overflow-hidden md:mt-20 md:h-88">
        <div className="mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] flex w-full justify-center pt-12">
          <motion.section
            style={
              {
                '--n': ringBaseCount,
                '--outer-r': `calc(max(var(--min-r), calc((var(--n) * var(--view-w) / ${ringBaseCount > 5 ? 4 : 3}) / 6.28)) * 1.08)`,
                '--inner-r': 'calc(var(--outer-r) * 0.72)',
                width: 'calc(var(--outer-r) * 2)',
                height: 'calc(var(--outer-r) * 2)',
              } as MotionStyle
            }
            className="relative rounded-full [--min-r:176px] [--s:64px] [--view-w:100vw] md:[--min-r:344px] md:[--s:128px] md:[--view-w:64rem]"
          >
            <motion.div style={{ rotate: rotation }} className="absolute inset-0">
              {outerTechStackData.map((item, i) => (
                <motion.div
                  key={`outer-${item.key}-${i}`}
                  onHoverStart={() => {
                    speed.set(0)
                  }}
                  onHoverEnd={() => {
                    speed.set(1)
                  }}
                  className={cn(
                    `absolute left-1/2 z-10 size-12 -translate-x-1/2 transition md:size-24`,
                  )}
                  style={{
                    rotate: i * (360 / outerTechStackData.length),
                    transformOrigin: 'center var(--outer-r)',
                  }}
                >
                  {item.component}
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              style={{
                rotate: reverseRotation,
                width: 'calc(var(--inner-r) * 2)',
                height: 'calc(var(--inner-r) * 2)',
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              {innerTechStackData.map((item, i) => (
                <motion.div
                  key={`inner-${item.key}-${i}`}
                  onHoverStart={() => {
                    speed.set(0)
                  }}
                  onHoverEnd={() => {
                    speed.set(1)
                  }}
                  className={cn(
                    `absolute left-1/2 z-20 size-[2.5rem] -translate-x-1/2 transition md:size-[5rem]`,
                  )}
                  style={{
                    rotate: i * (360 / innerTechStackData.length),
                    transformOrigin: 'center var(--inner-r)',
                  }}
                >
                  {item.component}
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}

export default TechStack
