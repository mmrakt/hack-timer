Object.assign(global, require('jest-chrome'))
// @ts-ignore
global.chrome.action = {
  setBadgeText: jest.fn(),
  setBadgeBackgroundColor: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  getBadgeBackgroundColor: jest.fn(),
  getBadgeText: jest.fn(),
  getPopup: jest.fn(),
  getTitle: jest.fn(),
  setIcon: jest.fn(),
  setTitle: jest.fn(),
  setPopup: jest.fn()
}

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

export {}
