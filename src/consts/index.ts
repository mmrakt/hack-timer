import { Phase } from '../types'

export const REMINING_SECONDS: {
  [T in Phase]: number;
} = {
  focus: 5,
  shortBreak: 6,
  longBreak: 1800
}

export const FOCUS_COUNT_UNTIL_LONG_BREAK = 4

export const FOCUS_BADGE_COLOR_CODE = '#0c4a6e'

export const BREAK_BADGE_COLOR_CODE = '#374151'
