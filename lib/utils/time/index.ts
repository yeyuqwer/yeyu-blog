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

export function toRelativeDate(date: number | Date) {
  const now = dayjs().tz(SHANGHAI)
  const target = dayjs(date).tz(SHANGHAI)
  const diff = now.valueOf() - target.valueOf()

  if (diff <= 0) return '刚刚'

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day

  if (diff < hour) {
    return `${Math.max(1, Math.floor(diff / minute))} 分钟前`
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`
  }

  if (diff <= week) {
    return `${Math.floor(diff / day)} 天前`
  }

  return target.locale('zh-cn').format('YYYY年M月D日')
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
