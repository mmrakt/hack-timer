import { Phase, FromPopupMessge, DailyFocusedCount } from '../types/index'
import { formatDisplayTime, getTimeFromSeconds } from '../utils/Time'
import dayjs from 'dayjs'
import {
  REMINING_SECONDS,
  FOCUS_COUNT_UNTIL_LONG_BREAK,
  FOCUS_BADGE_COLOR_CODE,
  BREAK_BADGE_COLOR_CODE
} from '../consts/index'
import keepAlive from './KeepAliveServiceWorker'

let intervalId = 0

// installed event
chrome.runtime.onInstalled.addListener(async () => {
  const reminingSeconds = REMINING_SECONDS.focus
  const phase: Phase = 'focus'
  await chrome.storage.local.set({
    reminingSeconds,
    phase,
    isRunning: false,
    totalFocusedCountInSession: 0,
    dailyFocusedCounts: []
  })
  await updateSecondsOfBadge(reminingSeconds)
  await updateColorOfBadge(phase)
})

// shortcut key event
chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case 'toggle_timer_status':
      await handleTimer(true)
      break
  }
})

// popup event
chrome.runtime.onMessage.addListener(
  (message: FromPopupMessge, sender, sendResponse) => {
    switch (message) {
      case 'mounted':
        chrome.storage.local.get(['reminingSeconds', 'isRunning'], (result) => {
          sendResponse(result)
        })
        break
      case 'resumeTimer':
        resumeTimer()
        sendResponse()
        break
      case 'pauseTimer':
        pauseTimer()
        sendResponse()
        break
      case 'finish':
        chrome.storage.local.get(
          ['phase', 'totalFocusedCountInSession', 'dailyFocusedCounts'],
          async (result) => {
            finish(
              result.phase,
              result.totalFocusedCountInSession,
              result.dailyFocusedCounts,
              false
            )
          }
        )
        break
      case 'displayHistory':
        chrome.storage.local.get(['dailyFocusedCounts'], (result) => {
          sendResponse(result)
        })
        break
    }
    return true
  }
)

// ステータスの切り替えとインターバルの管理
const handleTimer = async (needSendMessage = false): Promise<void> => {
  await keepAlive()

  await chrome.storage.local.get(
    ['reminingSeconds', 'phase', 'isRunning', 'totalFocusedCountInSession'],
    async ({ isRunning }) => {
      try {
        if (isRunning) {
          await pauseTimer()
        } else {
          await resumeTimer()
        }
        if (needSendMessage) {
          await chrome.runtime.sendMessage({
            message: 'toggleTimerStatus',
            toggledTimerStatus: !isRunning
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
  )
}

const resumeTimer = async (): Promise<void> => {
  await chrome.storage.local.set({ isRunning: true })
  toggleInterval(true)
}

const pauseTimer = async (): Promise<void> => {
  await chrome.storage.local.set({ isRunning: false })
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
  chrome.storage.local.get(
    [
      'reminingSeconds',
      'phase',
      'totalFocusedCountInSession',
      'dailyFocusedCounts'
    ],
    async ({
      reminingSeconds,
      phase,
      totalFocusedCountInSession,
      dailyFocusedCounts
    }) => {
      if (reminingSeconds > 0) {
        await countDown(reminingSeconds)
      }

      if (reminingSeconds === 0) {
        await finish(phase, totalFocusedCountInSession, dailyFocusedCounts)
      }
    }
  )
}

// カウントを減らす
const countDown = async (reminingSeconds: number): Promise<void> => {
  try {
    await chrome.storage.local.set({ reminingSeconds: reminingSeconds - 1 })
    await updateSecondsOfBadge(reminingSeconds - 1)
    await chrome.runtime.sendMessage({
      message: 'countDown',
      secs: reminingSeconds - 1
    })
  } catch (e) {
    console.error(e)
  }
}

const updateSecondsOfBadge = async (reminingSeconds: number): Promise<void> => {
  const { seconds, minutes } = getTimeFromSeconds(reminingSeconds)
  await chrome.action.setBadgeText({
    text: formatDisplayTime(seconds, minutes)
  })
}

const updateColorOfBadge = async (phase: Phase): Promise<void> => {
  const color =
    phase === 'focus' ? FOCUS_BADGE_COLOR_CODE : BREAK_BADGE_COLOR_CODE
  await chrome.action.setBadgeBackgroundColor({ color })
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
    await chrome.storage.local.set({
      reminingSeconds,
      phase: nextPhase,
      totalFocusedCountInSession,
      isRunning: false,
      dailyFocusedCounts
    })
    await updateSecondsOfBadge(reminingSeconds)
    await updateColorOfBadge(nextPhase)
    await chrome.runtime.sendMessage({
      message: 'finish',
      secs: reminingSeconds,
      phase: nextPhase
    })

    if (isAuto && currentPhase === 'focus') {
      await createTab()
    }
    toggleInterval(false)
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

const createTab = async (): Promise<void> => {
  await chrome.tabs.create({
    url: 'options.html'
  })
}

export { finish }
