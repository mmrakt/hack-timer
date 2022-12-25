// import the original type declarations
import 'i18next'
import * as jaTransration from 'locales/ja'
import * as enTransration from 'locales/en'

translation as jaTransration
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'ja'
    resources: {
      ja: typeof jaTransration
      en: typeof enTransration
    }
  }
}
