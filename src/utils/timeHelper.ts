import { DailyPomodoro } from '../types/index'
const getTimeFromSeconds = (
  secs: number
): {
  seconds: number
  minutes: number
} => {
  const totalSeconds = Math.ceil(secs)
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return {
    seconds,
    minutes
  }
}

const formatDisplayTime = (seconds: number, minutes: number): string => {
  const formatSeconds = seconds >= 10 ? String(seconds) : '0' + String(seconds)
  const formatMinutes = minutes >= 10 ? String(minutes) : '0' + String(minutes)
  return `${formatMinutes}:${formatSeconds}`
}

const extractTodayPomodoroCount = (dailyPomodoros: DailyPomodoro[]): number => {
  return dailyPomodoros.slice(-1)[0].count
}

export { getTimeFromSeconds, formatDisplayTime, extractTodayPomodoroCount }
