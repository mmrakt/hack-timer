import { FromPopupMessge, StorageValue } from '../types/index'
import { REMINING_SECONDS } from '../consts/index'
import { testData } from '../utils/testDate'
import { runtime, getStorage, setStorage, commands } from '../utils/chrome'
import '../utils/i18n'
import { closeTabs } from './Tab'
import { updateSecondsOfBadge, updateColorOfBadge } from './Action'
import { toggleTimerStatus, expire, pauseTimer, resumeTimer } from './Timer'

const initialStorageValue: StorageValue = {
  reminingSeconds: REMINING_SECONDS.focus,
  phase: 'focus',
  isRunning: false,
  totalPomodoroCountsInSession: 0,
  dailyPomodoros: testData, // 開発用
  showNewTabNotificationWhenPomodoro: true,
  showNewTabNotificationWhenBreak: true,
  showDesktopNotificationWhenPomodoro: false,
  showDesktopNotificationWhenBreak: false,
  pomodoroLength: 25,
  breakLength: 5,
  longBreakLength: 30,
  pomodoroCountUntilLongBreak: 4
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
      await toggleTimerStatus(true)
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
      case 'expire':
        getStorage([
          'phase',
          'totalPomodoroCountsInSession',
          'dailyPomodoros',
          'pomodoroCountUntilLongBreak'
        ]).then((data: StorageValue) => {
          expire(
            data.phase,
            data.totalPomodoroCountsInSession,
            data.dailyPomodoros,
            data.pomodoroCountUntilLongBreak,
            false
          )
        })
        break
      case 'displayHistory':
        getStorage(['dailyPomodoros']).then((data) => {
          sendResponse(data)
        })
        break
    }
    return true
  }
)
