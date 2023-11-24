import * as jaTranslation from '@/_locales/ja'
import * as enTranslation from '@/_locales/en'
import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

let debug = false
if (process.env.NODE_ENV === 'development') {
  debug = true
}

if (process.env.NODE_ENV !== 'test') {
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      debug,
      resources: {
        ja: jaTranslation,
        en: enTranslation
      },
      fallbackLng: 'en'
    })
}
