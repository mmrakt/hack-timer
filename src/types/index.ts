export type Response = {
  id: string
}

export type ReminingSeconds = {
  focus: 1500
  break: 300
  longBreak: 1800
}

export type Phase = 'focus' | 'break' | 'longBreak'

export type PageType = 'timer' | 'history' | 'settings'

export type DailyPomodoro = {
  year: number
  month: number
  day: number
  count: number
}

export type StorageValue = {
  reminingSeconds: number
  phase: Phase
  totalPomodoroCountsInSession: number
  dailyPomodoros: DailyPomodoro[]
  isRunning: boolean
  showNewTabNotificationWhenPomodoro: boolean
  showNewTabNotificationWhenBreak: boolean
  showDesktopNotificationWhenPomodoro: boolean
  showDesktopNotificationWhenBreak: boolean
  pomodoroLength: number
  breakLength: number
  longBreakLength: number
  pomodoroCountUntilLongBreak: number
}

export type StorageKey = keyof StorageValue

export type FromServiceWorkerMessge =
  | 'reduceCount'
  | 'toggleTimerStatus'
  | 'expire'
  | 'playTimerSound'

export type FromPopupMessge =
  | 'displayPopup'
  | 'resume'
  | 'pause'
  | 'expire'
  | 'displayHistory'

export type DisplayTerm = 'week' | 'month' | 'year'

export type DataSet = Array<{
  name: string | number
  count: number
}>
