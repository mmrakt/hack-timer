import dayjs from 'dayjs'
import { DEFAULT_TIMER_LENGTH } from '../consts'
import { StorageValue, Phase, DailyPomodoro } from '../types'
import { getStorage, runtime, setStorage } from '../utils/chrome'
import { updateSecondsOfBadge, updateColorOfBadge } from './Action'
import { openNewTab } from './Tab'
import { createNotificationContent, sendNotification } from './Notification'
import keepAlive from '../utils/keepAliveServiceWorker'

let intervalId = 0

const toggleTimerStatus = async (needSendMessage = false): Promise<void> => {
  await keepAlive()

  getStorage([
    'reminingSeconds',
    'phase',
    'isRunning',
    'totalPomodoroCountsInSession'
  ]).then(async (data: StorageValue) => {
    try {
      if (data.isRunning) {
        await pauseTimer()
      } else {
        await resumeTimer()
      }
      if (needSendMessage) {
        await runtime.sendMessage({
          message: 'toggleTimerStatus',
          toggledTimerStatus: !data.isRunning
        })
      }
    } catch (e) {
      console.error(e)
    }
  })
}

const setTickInterval = (isRunning: boolean): void => {
  if (isRunning) {
    intervalId = Number(setInterval(handleCountDown, 1000))
  } else {
    clearInterval(intervalId)
    intervalId = 0
  }
}

// running時は毎秒実行され、カウントを減らすか終了させるか判定
const handleCountDown = (): void => {
  getStorage(['reminingSeconds']).then(async (data: StorageValue) => {
    if (data.reminingSeconds > 0) {
      await reduceCount(data.reminingSeconds)
    }

    if (data.reminingSeconds === 0) {
      const {
        phase,
        totalPomodoroCountsInSession,
        dailyPomodoros,
        pomodoroCountUntilLongBreak
      } = await getStorage([
        'phase',
        'totalPomodoroCountsInSession',
        'dailyPomodoros',
        'pomodoroCountUntilLongBreak'
      ])
      await expire(
        phase,
        totalPomodoroCountsInSession,
        dailyPomodoros,
        pomodoroCountUntilLongBreak
      )
    }
  })
}

const reduceCount = async (reminingSeconds: number): Promise<void> => {
  try {
    setStorage({ reminingSeconds: reminingSeconds - 1 })
    await updateSecondsOfBadge(reminingSeconds - 1)
    await runtime.sendMessage({
      message: 'reduceCount',
      secs: reminingSeconds - 1
    })
  } catch (e) {
    console.error(e)
  }
}

const expire = async (
  phase: Phase,
  totalPomodoroCountsInSession: number,
  dailyPomodoros: DailyPomodoro[],
  pomodoroCountUntilLongBreak: number,
  isAutoExpire = true
): Promise<void> => {
  let reminingSeconds = 0
  let nextPhase: Phase = 'focus'
  if (phase === 'focus') {
    totalPomodoroCountsInSession++
    if (totalPomodoroCountsInSession === pomodoroCountUntilLongBreak) {
      reminingSeconds = DEFAULT_TIMER_LENGTH.longBreak
      totalPomodoroCountsInSession = 0
      nextPhase = 'longBreak'
    } else {
      reminingSeconds = DEFAULT_TIMER_LENGTH.break
      nextPhase = 'break'
    }
    dailyPomodoros = increaseDailyPomodoro(dailyPomodoros)
  } else {
    reminingSeconds = DEFAULT_TIMER_LENGTH.focus
  }
  try {
    setStorage({
      reminingSeconds,
      phase: nextPhase,
      totalPomodoroCountsInSession,
      isRunning: false,
      dailyPomodoros
    })
    await updateSecondsOfBadge(reminingSeconds)
    await updateColorOfBadge(nextPhase)

    if (isAutoExpire) {
      getStorage([
        'showDesktopNotificationWhenBreak',
        'showDesktopNotificationWhenPomodoro',
        'showNewTabNotificationWhenBreak',
        'showNewTabNotificationWhenPomodoro'
      ]).then(async (data: StorageValue) => {
        const {
          showDesktopNotificationWhenBreak,
          showDesktopNotificationWhenPomodoro,
          showNewTabNotificationWhenBreak,
          showNewTabNotificationWhenPomodoro
        } = data

        if (phase === 'focus') {
          if (showDesktopNotificationWhenPomodoro) {
            const [title, message] = await createNotificationContent(
              phase,
              dailyPomodoros.slice(-1)[0].count,
              pomodoroCountUntilLongBreak - totalPomodoroCountsInSession
            )
            sendNotification(title, message)
          }
          if (showNewTabNotificationWhenPomodoro) {
            openNewTab()
          }
        } else {
          if (showDesktopNotificationWhenBreak) {
            const [title, message] = await createNotificationContent(
              phase,
              dailyPomodoros.slice(-1)[0].count,
              pomodoroCountUntilLongBreak - totalPomodoroCountsInSession
            )
            sendNotification(title, message)
          }
          if (showNewTabNotificationWhenBreak) {
            openNewTab()
          }
        }
      })
    }
    setTickInterval(false)
    // popup非表示時はここで止まってしまうため最後に実行する
    await runtime.sendMessage({
      message: 'expire',
      secs: reminingSeconds,
      phase: nextPhase
    })
  } catch (e) {
    console.error(e)
  }
}

const increaseDailyPomodoro = (
  dailyPomodoros: DailyPomodoro[]
): DailyPomodoro[] => {
  const today = dayjs()
  const year = today.year()
  const month = today.month()
  const day = today.date()

  const lastPomodoroDate = dailyPomodoros.slice(-1)
  if (lastPomodoroDate.length > 0) {
    if (
      lastPomodoroDate[0].year === year &&
      lastPomodoroDate[0].month === month &&
      lastPomodoroDate[0].day === day
    ) {
      dailyPomodoros.slice(-1)[0].count++
      return dailyPomodoros
    }
  }
  dailyPomodoros.push({
    year,
    month,
    day,
    count: 1
  })

  return dailyPomodoros
}

const resumeTimer = async (): Promise<void> => {
  setStorage({ isRunning: true })
  setTickInterval(true)
}

const pauseTimer = async (): Promise<void> => {
  setStorage({ isRunning: false })
  setTickInterval(false)
}

export {
  toggleTimerStatus,
  handleCountDown,
  expire,
  reduceCount,
  resumeTimer,
  pauseTimer
}
