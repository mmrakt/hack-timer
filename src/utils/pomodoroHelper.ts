import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import { DailyPomodoro } from '@/types'

dayjs.extend(dayOfYear)

const extractTodayPomodoroCount = (dailyPomodoros: DailyPomodoro[]): number => {
  if (dailyPomodoros.length === 0) return 0
  const d = dayjs()
  const last = dailyPomodoros.slice(-1)[0]
  if (
    last.year === d.year() &&
    last.month === d.month() + 1 &&
    last.day === d.date()
  ) {
    return last.count
  }
  return 0
}

export { extractTodayPomodoroCount }
