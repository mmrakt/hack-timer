import { COLOR } from '@/consts/color'
import { Phase } from '@/types'
import { action } from '@/utils/chrome'
import { getTimeFromSeconds, formatDisplayTime } from '@/utils/timeHelper'

const updateSecondsOfBadge = async (
  remainingSeconds: number
): Promise<void> => {
  const { seconds, minutes } = getTimeFromSeconds(remainingSeconds)
  await action.setBadgeText({
    text: formatDisplayTime(seconds, minutes)
  })
}

const updateColorOfBadge = async (phase: Phase): Promise<void> => {
  const color = phase === 'focus' ? COLOR.primary : COLOR.secondary
  await action.setBadgeBackgroundColor({ color })
}

export { updateColorOfBadge, updateSecondsOfBadge }
