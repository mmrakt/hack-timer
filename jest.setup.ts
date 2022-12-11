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
export {}
