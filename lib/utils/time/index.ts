import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

const SHANGHAI = 'Asia/Shanghai'

export function sayHi() {
  const hour = dayjs().tz(SHANGHAI).hour()

  if (hour < 6) {
    return '凌晨不好喵...'
  } else if (hour < 9) {
    return '早上好喵~'
  } else if (hour < 12) {
    return '上午好喵~'
  } else if (hour < 14) {
    return '中午好喵~'
  } else if (hour < 17) {
    return '下午好喵~'
  } else if (hour < 19) {
    return '傍晚好喵~'
  } else {
    return '晚上好喵~'
  }
}

export function prettyDateTime(date: number | Date) {
  return dayjs(date).tz(SHANGHAI).locale('zh-cn').format('YY年M月D日 H时 m分')
}

export function toDisplayDate(date: number | Date) {
  return dayjs(date).tz(SHANGHAI).locale('en').format('MMM DD, YYYY')
}

export function getRemainingDaysOfYear(): number {
  const endOfYear = dayjs().tz(SHANGHAI).endOf('year')
  const now = dayjs().tz(SHANGHAI)
  return endOfYear.diff(now, 'day')
}

export function getYearProgress(): { passed: number; remaining: number } {
  const now = dayjs().tz(SHANGHAI)
  const startOfYear = now.startOf('year')
  const endOfYear = now.endOf('year')

  const totalMs = endOfYear.diff(startOfYear)
  const passedMs = now.diff(startOfYear)

  const passedPercentage = (passedMs / totalMs) * 100
  const remainingPercentage = 100 - passedPercentage

  return {
    passed: Number(passedPercentage.toFixed(2)),
    remaining: Number(remainingPercentage.toFixed(2)),
  }
}

export function getTodayDayInfo(): { year: number; dayOfYear: number } {
  const now = dayjs().tz(SHANGHAI)
  const startOfYear = now.startOf('year')
  const dayOfYear = now.diff(startOfYear, 'day') + 1

  return {
    year: now.year(),
    dayOfYear,
  }
}
