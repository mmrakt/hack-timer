import { DailyPomodoro } from '../types'

const extractTodayPomodoroCount = (dailyPomodoros: DailyPomodoro[]): number => {
  if (dailyPomodoros.length === 0) return 0
  return dailyPomodoros.slice(-1)[0].count
}

export { extractTodayPomodoroCount }
