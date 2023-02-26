import dayjs from 'dayjs'
import { StorageValue, Phase, DailyPomodoro, Message } from '../types'
import { getStorage, runtime, setStorage } from '../utils/chrome'
import { updateSecondsOfBadge, updateColorOfBadge } from './Action'
import { closeTabs, openNewTab } from './Tab'
import { createNotificationContent, sendNotification } from './Notification'
import keepAlive from '../utils/keepAliveServiceWorker'
import { FromServiceWorkerMessgeType } from '../utils/message'
import { extractTodayPomodoroCount } from '../utils/pomodoroHelper'

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
        await closeTabs()
        await resumeTimer()
      }
      if (needSendMessage) {
        await runtime.sendMessage<Message>({
          type: FromServiceWorkerMessgeType.TOGGLE_TIMER_STATUS,
          data: {
            toggledTimerStatus: !data.isRunning
          }
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

    if (data.reminingSeconds === 1) {
      const {
        phase,
        totalPomodoroCountsInSession,
        dailyPomodoros,
        pomodorosUntilLongBreak
      } = await getStorage([
        'phase',
        'totalPomodoroCountsInSession',
        'dailyPomodoros',
        'pomodorosUntilLongBreak'
      ])
      await expire(
        phase,
        totalPomodoroCountsInSession,
        dailyPomodoros,
        pomodorosUntilLongBreak
      )
    }
  })
}

const reduceCount = async (reminingSeconds: number): Promise<void> => {
  try {
    setStorage({ reminingSeconds: reminingSeconds - 1 })
    await updateSecondsOfBadge(reminingSeconds - 1)
    await runtime.sendMessage<Message>({
      type: FromServiceWorkerMessgeType.REDUCE_COUNT,
      data: {
        secs: reminingSeconds - 1
      }
    })
  } catch (e) {
    console.error(e)
  }
}

const expire = async (
  phase: Phase,
  totalPomodoroCountsInSession: number,
  dailyPomodoros: DailyPomodoro[],
  pomodorosUntilLongBreak: number,
  isAutoExpire = true
): Promise<void> => {
  let reminingSeconds = 0
  let nextPhase: Phase = 'focus'
  if (phase === 'focus') {
    totalPomodoroCountsInSession++
    if (totalPomodoroCountsInSession >= pomodorosUntilLongBreak) {
      reminingSeconds = await (
        await getStorage(['longBreakSeconds'])
      ).longBreakSeconds
      totalPomodoroCountsInSession = 0
      nextPhase = 'longBreak'
    } else {
      reminingSeconds = await (await getStorage(['breakSeconds'])).breakSeconds
      nextPhase = 'break'
    }
    dailyPomodoros = increaseDailyPomodoro(dailyPomodoros)
  } else {
    reminingSeconds = await (
      await getStorage(['pomodoroSeconds'])
    ).pomodoroSeconds
  }
  const todayTotalPomodoroCount = extractTodayPomodoroCount(dailyPomodoros)

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
              todayTotalPomodoroCount,
              pomodorosUntilLongBreak - totalPomodoroCountsInSession
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
              todayTotalPomodoroCount,
              pomodorosUntilLongBreak - totalPomodoroCountsInSession
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
    await runtime.sendMessage<Message>({
      type: FromServiceWorkerMessgeType.EXPIRE,
      data: {
        secs: reminingSeconds,
        phase: nextPhase,
        todayTotalPomodoroCount,
        totalPomodoroCountsInSession,
        pomodorosUntilLongBreak
      }
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
  const month = today.month() + 1
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
