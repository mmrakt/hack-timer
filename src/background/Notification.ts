import i18next from 'i18next'
import { Phase } from '../types'
import { notifications } from '../utils/chrome'

const createNotification = async (
  phase: Phase,
  todayPomodoros: number,
  totalPomodoroCountsInSession: number
): Promise<void> => {
  let title = ''
  let message = ''
  if (phase === 'focus') {
    title = i18next.t('notifications.pomodoro.title')
    message = i18next
      .t('notifications.pomodoro.message')
      .replace('%f', String(todayPomodoros))
      .replace('%s', String(totalPomodoroCountsInSession))
  } else {
    title = i18next.t('notifications.break.title')
    message = i18next
      .t('notifications.break.message')
      .replace('%f', String(todayPomodoros))
      .replace('%s', String(totalPomodoroCountsInSession))
  }
  notifications.create({
    title,
    message,
    type: 'basic',
    iconUrl: 'assets/img/kawauso.webp'
  })
}

export { createNotification }
