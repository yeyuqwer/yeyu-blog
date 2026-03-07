'use client'

import type { JSX } from 'react'
import {
  type MotionStyle,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
} from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'
// * svg
import {
  // GolangIcon,
  NestjsIcon,
  NextjsIcon,
  ReactIcon,
  TailwindcssIcon,
  TypeScriptIcon,
  VimIcon,
} from './assets/svg'

type TechItem = {
  key: string
  component: JSX.Element
}

const techStackData: TechItem[] = [
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
    key: 'vim',
    component: <VimIcon className="size-full" />,
  },
]

function TechStack() {
  const rotation = useMotionValue(0)
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
      <div className="mask-[linear-gradient(to_bottom,black_70%,transparent_100%)] flex h-35 justify-center overflow-hidden md:mt-20 md:h-70">
        <div className="mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] flex w-full justify-center pt-10">
          <motion.section
            style={
              {
                rotate: rotation,
                width: 'calc(var(--r) * 2)',
                height: 'calc(var(--r) * 2)',
                '--n': techStackData.length,
                '--r': `max(var(--min-r), calc((var(--n) * var(--view-w) / ${techStackData.length > 5 ? 4 : 3}) / 6.28))`,
              } as MotionStyle
            }
            className="relative rounded-full [--min-r:160px] [--s:64px] [--view-w:100vw] md:[--min-r:320px] md:[--s:128px] md:[--view-w:64rem]"
          >
            {techStackData.map((item, i) => (
              <motion.div
                key={item.key}
                onHoverStart={() => {
                  speed.set(0)
                }}
                onHoverEnd={() => {
                  speed.set(1)
                }}
                className={cn(
                  `absolute left-1/2 z-10 size-16 -translate-x-1/2 transition md:size-32`,
                )}
                style={{
                  rotate: i * (360 / techStackData.length),
                  transformOrigin: 'center var(--r)',
                }}
              >
                {item.component}
              </motion.div>
            ))}
          </motion.section>
        </div>
      </div>
    </div>
  )
}

export default TechStack
