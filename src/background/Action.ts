import { COLOR } from '../consts/color'
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
  const color = phase === 'focus' ? COLOR.focus : COLOR.break
  await action.setBadgeBackgroundColor({ color })
}

export { updateColorOfBadge, updateSecondsOfBadge }
