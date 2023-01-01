import i18next from 'i18next'
import { notifications } from '../utils/chrome'

const createNotification = async (): Promise<void> => {
  notifications.create({
    title: i18next.t('notifications.title'),
    message: i18next.t('notifications.message'),
    type: 'basic',
    iconUrl: 'assets/img/kawauso.webp'
  })
}

export { createNotification }
