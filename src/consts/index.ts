import { DailyPomodoro, PageType, Phase, StorageValue } from '../types'
import { testData } from '../utils/testDate'

const env = process.env.NODE_ENV

let dailyPomodoros: DailyPomodoro[] = []
let DEFAULT_TIMER_SECONDS: { [T in Phase]: number } = {
  focus: 1500,
  break: 300,
  longBreak: 900
}
if (env === 'development') {
  DEFAULT_TIMER_SECONDS = {
    focus: 5,
    break: 3,
    longBreak: 10
  }
  dailyPomodoros = testData
}

export { DEFAULT_TIMER_SECONDS }

export const DEFAULT_POPUP_PAGE_TYPE: PageType = 'timer'

export const DEFAULT_PHASE: Phase = 'focus'

export const DEFAULT_POMODOROS_UNTIL_LONG_BREAK = 4

export const DEFAULT_STORAGE_VALUE: StorageValue = {
  reminingSeconds: DEFAULT_TIMER_SECONDS.focus,
  phase: DEFAULT_PHASE,
  isRunning: false,
  totalPomodoroCountsInSession: 0,
  dailyPomodoros,
  showNewTabNotificationWhenPomodoro: true,
  showNewTabNotificationWhenBreak: true,
  showDesktopNotificationWhenPomodoro: true,
  showDesktopNotificationWhenBreak: true,
  pomodoroSeconds: DEFAULT_TIMER_SECONDS.focus,
  breakSeconds: DEFAULT_TIMER_SECONDS.break,
  longBreakSeconds: DEFAULT_TIMER_SECONDS.longBreak,
  pomodorosUntilLongBreak: DEFAULT_POMODOROS_UNTIL_LONG_BREAK,
  isTimerStarted: false,
  updatingPomodoroSeconds: 0,
  updatingBreakSeconds: 0,
  updatingLongBreakSeconds: 0
}

export const HISTORY_CSV_COLUMN_COUNT = 4

export const HISTORY_CSV_FILE_NAME = 'history.csv'

export const HISTORY_CSV_HEADER_ARRAY: Array<keyof DailyPomodoro> = [
  'year',
  'month',
  'day',
  'count'
]
export const BOM_ARRAY = [0xef, 0xbb, 0xbf]

export const EXPIRE_HTML_PATH = 'chrome-extension://*/expire.html'

// NOTE: リリース時は1は削除
export const POMODORO_LENGTH_ARRAY = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
]
export const BREAK_LENGTH_ARRAY = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
]
export const LONG_BREAK_LENGTH_ARRAY = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
]

export const POMODORO_COUNT_UNTIL_LONG_BREAK = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const EXPIRE_PAGE = 'expire.html'

export const NEW_LINE_CODE = {
  LF: '\n',
  CR: '\r',
  CRLF: '\r\n'
}

export const NUMBER_OF_MONTH_BY_YEAR = 12
export const NUMBER_OF_DAY_BY_WEEK = 7
