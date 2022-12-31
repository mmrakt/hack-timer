import * as jaTranslation from '../locales/ja'
import * as enTranslation from '../locales/en'
import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'

i18next.use(initReactI18next).init({
  lng: 'ja',
  debug: true,
  resources: {
    ja: jaTranslation,
    en: enTranslation
  }
})
