import type { FC } from 'react'
import { cn } from '@/lib/utils/common/shadcn'

export const YearCalendar: FC<{ year: number; dayOfYear: number }> = ({ year, dayOfYear }) => {
  const isLeapYear = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
  const daysInYear = isLeapYear ? 366 : 365
  const yearDays = Array.from({ length: daysInYear }, (_, index) => index + 1)

  return (
    <section className="w-fit max-w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
      <div
        className="grid w-max auto-cols-[0.625rem] grid-flow-col grid-rows-[repeat(7,0.625rem)] gap-1.5"
        aria-label={`${year} 年日历点阵`}
      >
        {yearDays.map(day => (
          <span
            key={day}
            className={cn(
              'size-2.5 rounded-full transition-colors',
              day <= dayOfYear ? 'bg-zinc-950 dark:bg-zinc-50' : 'bg-zinc-300 dark:bg-zinc-800',
            )}
            title={`${year} 年第 ${day} 天`}
            aria-label={`${year} 年第 ${day} 天${day <= dayOfYear ? '已过去' : '未过去'}`}
          />
        ))}
      </div>
    </section>
  )
}
