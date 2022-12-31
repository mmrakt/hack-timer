export type Response = {
  id: string
}

export type ReminingSeconds = {
  focus: 1500
  shortBreak: 300
  longBreak: 1800
}

export type Phase = 'focus' | 'shortBreak' | 'longBreak'

export type PageType = 'timer' | 'history' | 'settings'

export type DailyFocusedCount = {
  year: number
  month: number
  day: number
  count: number
}

export type StorageValue = {
  reminingSeconds: number
  phase: Phase
  totalFocusedCountInSession: number
  dailyFocusedCounts: DailyFocusedCount[]
  isRunning: boolean
}

export type StorageKey = keyof StorageValue

export type FromServiceWorkerMessge =
  | 'countDown'
  | 'toggleTimerStatus'
  | 'finish'
  | 'playTimerSound'

export type FromPopupMessge =
  | 'displayPopup'
  | 'resume'
  | 'pause'
  | 'finish'
  | 'displayHistory'

export type DisplayTerm = 'week' | 'month' | 'year'

export type DataSet = Array<{
  name: string | number
  count: number
}>
