import {
  Phase,
  FromPopupMessge,
  DailyFocusedCount,
  StorageValue
} from '../types/index'
import { formatDisplayTime, getTimeFromSeconds } from '../utils/Time'
import dayjs from 'dayjs'
import {
  REMINING_SECONDS,
  FOCUS_COUNT_UNTIL_LONG_BREAK,
  FOCUS_BADGE_COLOR_CODE,
  BREAK_BADGE_COLOR_CODE,
  START_BREAK_HTML_PATH
} from '../consts/index'
import keepAlive from './KeepAliveServiceWorker'
import {
  runtime,
  getStorage,
  setStorage,
  commands,
  action,
  tabs
} from './Chrome'

let intervalId = 0

const initialStorageValue: StorageValue = {
  reminingSeconds: REMINING_SECONDS.focus,
  phase: 'focus',
  isRunning: false,
  totalFocusedCountInSession: 0,
  dailyFocusedCounts: []
}

runtime.onInstalled.addListener(async () => {
  getStorage(['reminingSeconds']).then((data) => {
    if (!data?.reminingSeconds) {
      setStorage(initialStorageValue)
    }
  })

  await updateSecondsOfBadge(initialStorageValue.reminingSeconds)
  await updateColorOfBadge(initialStorageValue.phase)
})

// shortcut key event
commands.onCommand.addListener(async (command) => {
  switch (command) {
    case 'toggle_timer_status':
      await handleTimer(true)
      break
  }
})

// popup event
runtime.onMessage.addListener(
  (message: FromPopupMessge, sender, sendResponse) => {
    switch (message) {
      case 'displayPopup':
        getStorage(['reminingSeconds', 'isRunning']).then((data) => {
          sendResponse(data)
        })
        break
      case 'resume':
        resumeTimer()
        closeTabs()
        sendResponse()
        break
      case 'pause':
        pauseTimer()
        sendResponse()
        break
      case 'finish':
        getStorage([
          'phase',
          'totalFocusedCountInSession',
          'dailyFocusedCounts'
        ]).then((data: StorageValue) => {
          finish(
            data.phase,
            data.totalFocusedCountInSession,
            data.dailyFocusedCounts,
            false
          )
        })
        break
      case 'displayHistory':
        getStorage(['dailyFocusedCounts']).then((data) => {
          sendResponse(data)
        })
        break
    }
    return true
  }
)

// ステータスの切り替えとインターバルの管理
const handleTimer = async (needSendMessage = false): Promise<void> => {
  await keepAlive()

  getStorage([
    'reminingSeconds',
    'phase',
    'isRunning',
    'totalFocusedCountInSession'
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

const resumeTimer = async (): Promise<void> => {
  setStorage({ isRunning: true })
  toggleInterval(true)
}

const pauseTimer = async (): Promise<void> => {
  setStorage({ isRunning: false })
  toggleInterval(false)
}

const toggleInterval = (isRunning: boolean): void => {
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
    'totalFocusedCountInSession',
    'dailyFocusedCounts'
  ]).then(async (data: StorageValue) => {
    if (data.reminingSeconds > 0) {
      await countDown(data.reminingSeconds)
    }

    if (data.reminingSeconds === 0) {
      await finish(
        data.phase,
        data.totalFocusedCountInSession,
        data.dailyFocusedCounts
      )
    }
  })
}

// カウントを減らす
const countDown = async (reminingSeconds: number): Promise<void> => {
  try {
    setStorage({ reminingSeconds: reminingSeconds - 1 })
    await updateSecondsOfBadge(reminingSeconds - 1)
    await runtime.sendMessage({
      message: 'countDown',
      secs: reminingSeconds - 1
    })
  } catch (e) {
    console.error(e)
  }
}

const updateSecondsOfBadge = async (reminingSeconds: number): Promise<void> => {
  const { seconds, minutes } = getTimeFromSeconds(reminingSeconds)
  await action.setBadgeText({
    text: formatDisplayTime(seconds, minutes)
  })
}

const updateColorOfBadge = async (phase: Phase): Promise<void> => {
  const color =
    phase === 'focus' ? FOCUS_BADGE_COLOR_CODE : BREAK_BADGE_COLOR_CODE
  await action.setBadgeBackgroundColor({ color })
}

const finish = async (
  currentPhase: Phase,
  totalFocusedCountInSession: number,
  dailyFocusedCounts: DailyFocusedCount[],
  isAuto = true
): Promise<void> => {
  let reminingSeconds = 0
  let nextPhase: Phase = 'focus'
  if (currentPhase === 'focus') {
    totalFocusedCountInSession++
    if (totalFocusedCountInSession === FOCUS_COUNT_UNTIL_LONG_BREAK) {
      reminingSeconds = REMINING_SECONDS.longBreak
      totalFocusedCountInSession = 0
      nextPhase = 'longBreak'
    } else {
      reminingSeconds = REMINING_SECONDS.shortBreak
      nextPhase = 'shortBreak'
    }
    dailyFocusedCounts = addDailyFocusedCount(dailyFocusedCounts)
  } else {
    reminingSeconds = REMINING_SECONDS.focus
  }
  try {
    setStorage({
      reminingSeconds,
      phase: nextPhase,
      totalFocusedCountInSession,
      isRunning: false,
      dailyFocusedCounts
    })
    await updateSecondsOfBadge(reminingSeconds)
    await updateColorOfBadge(nextPhase)

    if (isAuto && currentPhase === 'focus') {
      createTab()
    }
    toggleInterval(false)
    // popup非表示時はここで止まってしまうため最後に実行する
    await runtime.sendMessage({
      message: 'finish',
      secs: reminingSeconds,
      phase: nextPhase
    })
  } catch (e) {
    console.error(e)
  }
}

const addDailyFocusedCount = (
  dailyFocusedCounts: DailyFocusedCount[]
): DailyFocusedCount[] => {
  const today = dayjs()
  const year = today.year()
  const month = today.month()
  const day = today.date()

  const lastFocusedDate = dailyFocusedCounts.slice(-1)
  if (lastFocusedDate.length > 0) {
    if (
      lastFocusedDate[0].year === year &&
      lastFocusedDate[0].month === month &&
      lastFocusedDate[0].day === day
    ) {
      dailyFocusedCounts.slice(-1)[0].count++
      return dailyFocusedCounts
    }
  }
  dailyFocusedCounts.push({
    year,
    month,
    day,
    count: 1
  })

  return dailyFocusedCounts
}

const createTab = (): void => {
  tabs.create({
    url: 'start-break.html'
  })
}

const closeTabs = async (): Promise<void> => {
  await tabs.query({ url: START_BREAK_HTML_PATH }, async (result) => {
    result.forEach(async (tab) => {
      if (tab.id) {
        await tabs.remove(tab.id)
      }
    })
  })
}

export { finish }
