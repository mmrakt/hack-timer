export interface Response {
  id: string
}

export interface ReminingSeconds {
  focus: 1500
  shortBreak: 300
  longBreak: 1800
}

export type Phase = 'focus' | 'shortBreak' | 'longBreak'

export type PageType = 'timer' | 'history' | 'setting'

export interface DailyFocusedCount {
  year: number
  month: number
  day: number
  count: number
}

export interface StorageValue {
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

export type FromPopupMessge =
  | 'mounted'
  | 'resumeTimer'
  | 'pauseTimer'
  | 'finish'
  | 'displayHistory'

export type DisplayTerm = 'week' | 'month' | 'year'

export type DataSet = Array<{
  name: string | number
  count: number
}>
