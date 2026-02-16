import type { ComponentProps, FC } from 'react'
import * as motion from 'motion/react-client'
import { getRemainingDaysOfYear, getTodayDayInfo, getYearProgress } from '@/lib/utils/time'
import { Greeting } from './greeting'

export const AdminHomePage: FC<ComponentProps<'div'>> = () => {
  const { year, dayOfYear } = getTodayDayInfo()

  return (
    <motion.main
      className="m-auto flex flex-col items-center justify-center text-lg"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <div className="m-auto flex flex-col items-center justify-center text-lg">
        <Greeting />
        <h2 className="font-bold">
          今天是 <span className="text-indigo-400">{year}</span> 的第{' '}
          <span className="text-indigo-500">{dayOfYear}</span> 天
        </h2>
        <p>
          今年已经过去了 <span className="text-pink-400">{getYearProgress().passed}%</span>{' '}
          距离今年结束还有 <span className="text-pink-400">{getRemainingDaysOfYear()}</span> 天
        </p>
        <p>你比昨天更优秀了一点吗?</p>
        <p>没有也没关系</p>
        <p>活着开心最重要</p>
      </div>
    </motion.main>
  )
}
