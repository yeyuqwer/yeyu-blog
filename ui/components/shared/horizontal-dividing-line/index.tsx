'use client'

import { motion, useAnimationFrame, useMotionValue } from 'motion/react'
import { useState } from 'react'
import { useTransitionTheme } from '@/hooks/animation'
import { FlowerIcon } from './flower-icon'

// * 拖拽两边移动距离阈值，超过触发
// * 移动端拉不了多少...所以调低点，虽然会让 pc 端很容易触发
// * 25 年底才发现，半年前的自己是傻逼了，不知道可以响应式判断嘛...
const THRESHOLD = 100

export default function HorizontalDividingLine() {
  const { resolvedTheme, setTransitionTheme } = useTransitionTheme()
  const rotate = useMotionValue(0)
  const [duration, setDuration] = useState(4)

  useAnimationFrame((_, delta) => {
    rotate.set(rotate.get() + (360 * delta) / (duration * 1000))
  })

  const borderColor = resolvedTheme === 'light' ? 'var(--clear-sky-primary)' : '#edededcc'
  const fill = resolvedTheme === 'light' ? '#6FC3C4' : '#edededcc'

  return (
    <div className="relative flex w-full items-center justify-center">
      <hr
        className="absolute left-0 w-[45%] border-dashed dark:border-accent"
        style={{ borderColor }}
      />
      <motion.div
        style={{ rotate }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.15}
        whileDrag={{ cursor: 'grabbing' }}
        onDragStart={() => setDuration(0.8)}
        onDragEnd={(_, info) => {
          setDuration(4)
          if (info.offset.x < -THRESHOLD) {
            setTransitionTheme('light', { direction: 'left' })
          } else if (info.offset.x > THRESHOLD) {
            setTransitionTheme('dark', { direction: 'right' })
          }
        }}
        className="cursor-grab"
      >
        <FlowerIcon fill={fill} />
      </motion.div>
      <hr
        className="absolute right-0 w-[45%] border-dashed dark:border-accent"
        style={{ borderColor }}
      />
    </div>
  )
}
