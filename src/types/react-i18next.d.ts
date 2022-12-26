// import the original type declarations
import 'react-i18next'
import * as ja from 'locales/ja'
import * as en from 'locales/en'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'ja'
    resources: {
      ja: typeof ja
      en: typeof en
    }
  }
}
