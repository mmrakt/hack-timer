import { FromPopupMessge, StorageValue } from '../types/index'
import { runtime, getStorage, setStorage, commands } from '../utils/chrome'
import '../utils/i18n'
import { closeTabs } from './Tab'
import { updateSecondsOfBadge, updateColorOfBadge } from './Action'
import { toggleTimerStatus, expire, pauseTimer, resumeTimer } from './Timer'
import { DEFAULT_STORAGE_VALUE } from '../consts/index'

runtime.onInstalled.addListener(async () => {
  getStorage(['reminingSeconds']).then((data) => {
    if (!data?.reminingSeconds) {
      setStorage(DEFAULT_STORAGE_VALUE)
    }
  })

  await updateSecondsOfBadge(DEFAULT_STORAGE_VALUE.reminingSeconds)
  await updateColorOfBadge(DEFAULT_STORAGE_VALUE.phase)
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
