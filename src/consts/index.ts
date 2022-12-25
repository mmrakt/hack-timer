import { DailyFocusedCount, Phase } from '../types'

export const REMINING_SECONDS: {
  [T in Phase]: number
} = {
  focus: 10,
  shortBreak: 6,
  longBreak: 1800
}

export const EXPORT_CSV_BUTTON_TEXT = 'Export History'
export const IMPORT_CSV_BUTTON_TEXT = 'Import History'
export const FOCUS_COUNT_UNTIL_LONG_BREAK = 4

export const HISTORY_CSV_COLUMN_COUNT = 4

export const HISTORY_CSV_FILE_NAME = 'history.csv'

export const HISTORY_CSV_HEADER_ARRAY: Array<keyof DailyFocusedCount> = [
  'year',
  'month',
  'day',
  'count'
]
export const BOM_ARRAY = [0xef, 0xbb, 0xbf]

export const FOCUS_BADGE_COLOR_CODE = '#0c4a6e'

export const BREAK_BADGE_COLOR_CODE = '#374151'

export const START_BREAK_HTML_PATH = 'chrome-extension://*/start-break.html'
