import i18next from 'i18next'
import { Phase } from '../types'
import { notifications } from '../utils/chrome'

const createNotificationContent = async (
  phase: Phase,
  todayPomodoro: number,
  reminingPomodorUntilLongBreak: number
): Promise<string[]> => {
  let title = ''
  let message = ''
  if (phase === 'focus') {
    title = i18next.t('notifications.pomodoro.title')
    message = i18next
      .t('notifications.pomodoro.message')
      .replace('%f', String(todayPomodoro))
      .replace('%s', String(reminingPomodorUntilLongBreak))
  } else {
    title = i18next.t('notifications.break.title')
    message = i18next
      .t('notifications.break.message')
      .replace('%f', String(todayPomodoro))
      .replace('%s', String(reminingPomodorUntilLongBreak))
  }
  return [title, message]
}

const sendNotification = async (
  title: string,
  message: string
): Promise<void> => {
  notifications.create({
    title,
    message,
    type: 'basic',
    iconUrl: 'assets/img/kawauso.webp'
  })
}

export { sendNotification, createNotificationContent }
