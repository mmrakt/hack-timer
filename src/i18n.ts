import * as jaTranslation from './locales/ja'
import * as enTranslation from './locales/en'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'

i18n.use(initReactI18next).init({
  lng: 'ja',
  resources: {
    ja: jaTranslation,
    en: enTranslation
  }
})
