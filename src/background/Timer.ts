import dayjs from 'dayjs'
import { POMODORO_COUNT_UNTIL_LONG_BREAK, REMINING_SECONDS } from '../consts'
import { StorageValue, Phase, dailyPomodoro } from '../types'
import { getStorage, runtime, setStorage } from '../utils/chrome'
import { updateSecondsOfBadge, updateColorOfBadge } from './Action'
import { openNewTab } from './Tab'
import { createNotification } from './Notification'
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
  getStorage([
    'reminingSeconds',
    'phase',
    'totalPomodoroCountsInSession',
    'dailyPomodoros'
  ]).then(async (data: StorageValue) => {
    if (data.reminingSeconds > 0) {
      await reduceCount(data.reminingSeconds)
    }

    if (data.reminingSeconds === 0) {
      await expire(
        data.phase,
        data.totalPomodoroCountsInSession,
        data.dailyPomodoros
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
  currentPhase: Phase,
  totalPomodoroCountsInSession: number,
  dailyPomodoros: dailyPomodoro[],
  isAutoExpire = true
): Promise<void> => {
  let reminingSeconds = 0
  let nextPhase: Phase = 'focus'
  if (currentPhase === 'focus') {
    totalPomodoroCountsInSession++
    if (totalPomodoroCountsInSession === POMODORO_COUNT_UNTIL_LONG_BREAK) {
      reminingSeconds = REMINING_SECONDS.longBreak
      totalPomodoroCountsInSession = 0
      nextPhase = 'longBreak'
    } else {
      reminingSeconds = REMINING_SECONDS.break
      nextPhase = 'break'
    }
    dailyPomodoros = increaseDailyPomodoro(dailyPomodoros)
  } else {
    reminingSeconds = REMINING_SECONDS.focus
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

    const {
      showDesktopNotificationWhenBreak,
      showDesktopNotificationWhenPomodoro,
      showNewTabNotificationWhenBreak,
      showNewTabNotificationWhenPomodoro
    } = await getStorage([
      'showDesktopNotificationWhenBreak',
      'showDesktopNotificationWhenPomodoro',
      'showNewTabNotificationWhenBreak',
      'showNewTabNotificationWhenPomodoro'
    ])
    if (isAutoExpire) {
      if (currentPhase === 'focus') {
        if (showDesktopNotificationWhenPomodoro) {
          createNotification(
            currentPhase,
            dailyPomodoros.slice(-1)[0].count,
            totalPomodoroCountsInSession
          )
        }
        if (showNewTabNotificationWhenPomodoro) {
          openNewTab()
        }
      } else {
        if (showDesktopNotificationWhenBreak) {
          createNotification(
            currentPhase,
            dailyPomodoros.slice(-1)[0].count,
            totalPomodoroCountsInSession
          )
        }
        if (showNewTabNotificationWhenBreak) {
          openNewTab()
        }
      }
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
  dailyPomodoros: dailyPomodoro[]
): dailyPomodoro[] => {
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
