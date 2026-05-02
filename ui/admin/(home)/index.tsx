import type { ComponentProps, FC } from 'react'
import * as motion from 'motion/react-client'
import { getTodayDayInfo } from '@/lib/utils/time'
import { OverviewStats } from './overview-stats'
import { YearCalendar } from './year-calendar'
import { YearSummary } from './year-summary'

export const AdminHomePage: FC<ComponentProps<'div'>> = () => {
  const { year, dayOfYear } = getTodayDayInfo()

  return (
    <motion.main
      className="m-auto flex w-full flex-col items-center justify-center gap-8"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <YearSummary year={year} dayOfYear={dayOfYear} />
      <OverviewStats />
      <YearCalendar year={year} dayOfYear={dayOfYear} />
    </motion.main>
  )
}
