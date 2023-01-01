import { FOCUS_BADGE_COLOR_CODE, BREAK_BADGE_COLOR_CODE } from '../consts'
import { Phase } from '../types'
import { action } from '../utils/chrome'
import { getTimeFromSeconds, formatDisplayTime } from '../utils/timeHelper'

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

export { updateColorOfBadge, updateSecondsOfBadge }
