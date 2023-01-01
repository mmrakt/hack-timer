import * as jaTranslation from '../locales/ja'
import * as enTranslation from '../locales/en'
import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'

if (process.env.NODE_ENV !== 'test') {
  i18next.use(initReactI18next).init({
    lng: 'ja',
    debug: false,
    resources: {
      ja: jaTranslation,
      en: enTranslation
    }
  })
}
