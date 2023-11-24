import dayjs from 'dayjs'
import { StorageValue, Phase, DailyPomodoro, Message } from '@/types'
import { getStorage, runtime, setStorage } from '@/utils/chrome'
import { updateSecondsOfBadge, updateColorOfBadge } from './Action'
import { closeTabs, openNewTab } from './Tab'
import { createNotificationContent, sendNotification } from './Notification'
import keepAlive from '@/utils/keepAliveServiceWorker'
import { FromServiceWorkerMessageType } from '@/utils/message'
import { extractTodayPomodoroCount } from '@/utils/pomodoroHelper'

let intervalId = 0

const toggleTimerStatus = async (needSendMessage = false): Promise<void> => {
  await keepAlive()

  getStorage([
    'remainingSeconds',
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
          type: FromServiceWorkerMessageType.TOGGLE_TIMER_STATUS,
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

/***
 * カウントを減らすか終了させるか判定
 */
const handleCountDown = (): void => {
  getStorage(['remainingSeconds']).then(async (data: StorageValue) => {
    if (data.remainingSeconds > 0) {
      await reduceCount(data.remainingSeconds)
    }

    if (data.remainingSeconds === 1) {
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

const reduceCount = async (remainingSeconds: number): Promise<void> => {
  try {
    setStorage({ remainingSeconds: remainingSeconds - 1 })
    await updateSecondsOfBadge(remainingSeconds - 1)
    await runtime.sendMessage<Message>({
      type: FromServiceWorkerMessageType.REDUCE_COUNT,
      data: {
        secs: remainingSeconds - 1
      }
    })
  } catch (e) {
    console.error(e)
  }
}

/***
 * ポモドーロ完了時の処理
 */
const expire = async (
  phase: Phase,
  totalPomodoroCountsInSession: number,
  dailyPomodoros: DailyPomodoro[],
  pomodorosUntilLongBreak: number,
  isAutoExpire = true
): Promise<void> => {
  let remainingSeconds = 0
  let nextPhase: Phase = 'focus'

  try {
    await updateTimerLength(phase)

    if (phase === 'focus') {
      totalPomodoroCountsInSession++
      if (totalPomodoroCountsInSession >= pomodorosUntilLongBreak) {
        remainingSeconds = await (
          await getStorage(['longBreakSeconds'])
        ).longBreakSeconds
        totalPomodoroCountsInSession = 0
        nextPhase = 'longBreak'
      } else {
        remainingSeconds = await (
          await getStorage(['breakSeconds'])
        ).breakSeconds
        nextPhase = 'break'
      }
      dailyPomodoros = increaseDailyPomodoro(dailyPomodoros)
    } else {
      remainingSeconds = await (
        await getStorage(['pomodoroSeconds'])
      ).pomodoroSeconds
    }
    const todayTotalPomodoroCount = extractTodayPomodoroCount(dailyPomodoros)

    setStorage({
      remainingSeconds,
      phase: nextPhase,
      totalPomodoroCountsInSession,
      isRunning: false,
      dailyPomodoros,
      isTimerStarted: false
    })
    await updateSecondsOfBadge(remainingSeconds)
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
      type: FromServiceWorkerMessageType.EXPIRE,
      data: {
        secs: remainingSeconds,
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

/***
 * 更新中のタイマー時間を反映
 */
const updateTimerLength = async (phase: Phase): Promise<void> => {
  if (phase === 'focus') {
    const updatingPomodoroSeconds = await (
      await getStorage(['updatingPomodoroSeconds'])
    ).updatingPomodoroSeconds
    if (updatingPomodoroSeconds !== 0) {
      setStorage({
        pomodoroSeconds: updatingPomodoroSeconds,
        updatingPomodoroSeconds: 0
      })
    }
  } else if (phase === 'break') {
    const updatingBreakSeconds = await (
      await getStorage(['updatingBreakSeconds'])
    ).updatingBreakSeconds
    if (updatingBreakSeconds !== 0) {
      setStorage({
        breakSeconds: updatingBreakSeconds,
        updatingBreakSeconds: 0
      })
    }
  } else if (phase === 'longBreak') {
    const updatingLongBreakSeconds = await (
      await getStorage(['updatingLongBreakSeconds'])
    ).updatingLongBreakSeconds
    if (updatingLongBreakSeconds !== 0) {
      setStorage({
        longBreakSeconds: updatingLongBreakSeconds,
        updatingLongBreakSeconds: 0
      })
    }
  }
}

/***
 * 当日分のポモドーロ完了数を +1
 */
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
  getStorage(['isTimerStarted']).then(({ isTimerStarted }) => {
    if (!isTimerStarted) {
      setStorage({ isTimerStarted: true })
    }
  })
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
